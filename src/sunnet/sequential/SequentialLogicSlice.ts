
module sunnet {
    /**
     * 逻辑片断
     * export
     */
    export abstract class SequentialLogicSlice extends SequentialSlice {
        /**
         * 先决时序
         * 说明：
         * 1. 在逻辑片断被构建时，若时序系统中存在先决时序，则此时序片段会被延时到所有先决时序全部执行完毕后再执行
         * 例如（捕鱼）：
         * 1. 子弹射需要在三叉戟或小游戏结束之后才允许被发射
         * 2. 倍率更改仅允许在技能结束之后才允许请求
         */
        private $dependencies: number[] = [];

        /**
         * 先决回调执行器
         */
        private $handler: suncom.IHandler = null;

        /**
         * 时序序号
         * 说明：
         * 1. 逻辑时序片断仅会响应以时序序号为下标的消息
         * 2. 当消息被响应时，此序号会+1
         */
        private $seqId: number = 0;

        /**
         * 时序命令列表
         * 说明：
         * 1. 在同一个逻辑片断中，命令首次出现的顺序必须与命令在此列表中的顺序一致
         * 2. 此列表只限制命令首次出现的顺序，对于己出现过的命令，重新出现顺序并不受限
         */
        private $commands: ISequentialCommandDfn[] = [];

        /**
         * 消息缓存列表
         * 说明：
         * 1. 时序片断会自动缓存命令列表中指定的网络消息，同时会逐帧派发己断言成功的网络消息
         * 2. 缓存列表中的消息派发规则是顺序派发，如果第一个消息未经断言，则后面即使是己断言的消息，也依旧不能被派发
         */
        private $messages: ISequentialMessageDfn[] = [];

        /**
         * @id: 时序ID，由外部枚举
         * @commands: 时序命令
         * export
         */
        constructor(id: number, commands: ISequentialCommandDfn[]) {
            super(id);
            this.$commands = commands;
            for (let i: number = 0; i < this.$commands.length; i++) {
                const dfn: ISequentialCommandDfn = this.$commands[i];
                if (dfn.type === SequentialCommandTypeEnum.MSG) {
                    MessageNotifier.register(dfn.name.toString(), this.$onMessage, this);
                }
                else if (dfn.type === SequentialCommandTypeEnum.GUI) {
                    this.facade.registerObserver(NotifyKey.GUI_SEQUENTIAL_NOTIFICATION, this.$onGUINotification, this);
                }
            }
            M.seqLogicSliceList.push(this);
        }

        /**
         * 等待条件
         * @ids: 先决时序ID
         * @conditions: 条件
         * @handler: 回调执行器
         * 说明：
         * 1. 若调用此接口，则当前时序不会立即执行，而是会先等待所有先决时序执行完毕，然后执行handler，由外部触发时间序的运行
         * 2. 一般调用此接口情况，时序命令列表中的命令应当是GUI时序消息而非网络时序消息，因为网络时序消息在接收到之后是自动解锁的
         * export
         */
        wait(ids: number[], conditions: any, handler?: suncom.IHandler): void {
            this.$handler = handler || null;
            SequentialSystem.matchSequentials(ids, conditions, this.$dependencies);
            this.facade.registerObserver(NotifyKey.SEQUENTIAL_SLICE_RELEASED, this.$onSliceReleased, this);
        }

        /**
         * 释放时序片断
         * export
         */
        release(): void {
            for (let i: number = 0; i < this.$commands.length; i++) {
                const dfn: ISequentialCommandDfn = this.$commands[i];
                if (dfn.type === SequentialCommandTypeEnum.MSG) {
                    MessageNotifier.unregister(dfn.name.toString(), this.$onMessage, this);
                }
                else if (dfn.type === SequentialCommandTypeEnum.GUI) {
                    this.facade.removeObserver(NotifyKey.GUI_SEQUENTIAL_NOTIFICATION, this.$onGUINotification, this);
                }
            }
            this.facade.removeObserver(NotifyKey.SEQUENTIAL_SLICE_RELEASED, this.$onSliceReleased, this);
        }

        /**
         * 帧事件回调
         * export
         */
        protected $onEnterFrame(): void {
            // 无缓存消息
            if (this.$messages.length === 0) {
                return;
            }
            // 存在先决时序
            if (this.$dependencies.length > 0) {
                return;
            }
            // 存在先决回调
            if (this.$handler !== null) {
                this.$handler.run();
                this.$handler = null;
            }

            // 待派发的网络时序消息
            const msg: ISequentialMessageDfn = this.$messages[0];

            let found: boolean = this.$seqId === this.$commands.length;
            if (found === false) {
                for (let i: number = 0; i < this.$seqId; i++) {
                    const cmd: ISequentialCommandDfn = this.$commands[i];
                    if (cmd.type === SequentialCommandTypeEnum.MSG && cmd.name === msg.name) {
                        found = true;
                        break;
                    }
                }
            }

            // 若命令己断言，则派发消息
            if (found === true) {
                MessageNotifier.notify(msg.name, [msg.data, 1]);
            }
        }

        /**
         * 响应时序片断释放消息
         */
        private $onSliceReleased(hashId: number): void {
            if (this.$dependencies.length > 0) {
                const index: number = this.$dependencies.indexOf(hashId);
                if (index > -1) {
                    this.$dependencies.splice(index, 1);
                }
            }
        }

        /**
         * 响应网络消息
         * @subCmd: 若为1，则不拦截，默认为0
         */
        protected $onMessage(name: string, data?: any, subCmd: number = 0): void {
            if (subCmd === 0 && this.$assertMessage(name, data) === true) {
                const message: ISequentialMessageDfn = {
                    name: name,
                    data: data
                }
                this.$messages.push(message);
                this.$assertCommand(SequentialCommandTypeEnum.MSG, name);
            }
        }

        /**
         * 响应GUI消息
         */
        protected $onGUINotification(...args: any[]): void {
            if (this.$asseretGUINotification.apply(this, args) === true) {
                this.$assertCommand(SequentialCommandTypeEnum.GUI, args[0]);
            }
        }

        /**
         * 命令断言
         * 说明：
         * 1. 断言命令是否为当前阻塞的命令
         */
        private $assertCommand(type: SequentialCommandTypeEnum, name: string): void {
            // 时序ID有效
            if (this.$seqId < this.$commands.length) {
                const command: ISequentialCommandDfn = this.$commands[this.$seqId];
                // 若为当前时序，则对时序序号进行递增
                if (command.type === type && command.name === name) {
                    this.$seqId++;
                }
            }
        }

        /**
         * 网络消息断言
         * 说明：
         * 1. 若断言的消息为当前时序所关心的消息，返回true，否则返回false
         * export
         */
        protected abstract $assertMessage(name: string, data?: any): boolean;

        /**
         * GUI消息断言
         * 说明：
         * 1. 若断言的消息为当前时序所关心的消息，返回true，否则返回false
         * export
         */
        protected abstract $asseretGUINotification(name: string, ...args: any[]): boolean;
    }
}