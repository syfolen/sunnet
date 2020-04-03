
module sunnet {
    /**
     * 时间片段
     */
    export abstract class SequentialTimeSlice extends SequentialSlice {
        /**
         * 网络连接对象
         */
        private $connection: INetConnection = null;

        /**
         * 创建在服务器上创建的时间
         */
        private $srvCreateTime: number = this.$connection.srvTime;

        /**
         * 片段时长
         */
        private $timeLen: number = 0;

        /**
         * 对象过去的时间
         */
        private $pastTime: number = 0;

        /**
         * 追帧时间（最小时间）
         */
        private $chaseTime: number = 0;

        /**
         * 当前时间流逝倍数
         */
        private $multiple: number = 1;

        /**
         * 时间流逝倍数（追帧时生效）
         * 说明：
         * 1. 当时差大于追帧时间时，时间应当以指定倍数来流逝
         * 2. 当时差小于或等于追帧时间时，时间流逝倍数将会在追帧时间内递减至1倍
         */
        private $multiples: number = 2;

        /**
         * 开始追帧时间（客户端时间）
         */
        private $chaseStartTime: number = 0;

        /**
         * @timeLen: 时间片断长度
         * @name: 网络连接对象名，默认为"default"
         * 说明：
         * 1. 客户端对象是不需要追帧的
         * export
         */
        constructor(timeLen: number, name: string = "default") {
            super();
            this.$timeLen = timeLen;
            this.$connection = M.connetionMap[name] || null;
        }

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @chaseTime: 追帧时间（秒），若为0，则不作追帧处理，默认为：2
         * @multiples: 时间流逝倍数，追帧专用，默认为：2
         * 说明：
         * 1. 若chaseTime为0，则multiples的值是无效的
         * export
         */
        updateCreateTime(createTime: number = 0, chaseTime: number = 2, multiples: number = 2): void {
            this.$chaseTime = chaseTime;
            this.$srvCreateTime = createTime > 0 ? createTime : this.$srvCreateTime;
            // 若追帧时间为0，则时间的流逝倍数是无效的
            this.$multiples = chaseTime === 0 ? 1 : multiples;
            // 若追帧时间为0，则表示无需追帧
            if (chaseTime === 0) {
                // 立即计算过去时间
                this.$pastTime = this.$getCurrentServerTimestamp() - this.$srvCreateTime;
            }
            else {
                // 记录开始追帧时间
                this.$chaseStartTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
        }

        /**
         * 帧事件回调（追帧算法实现函数）
         * export
         */
        protected $onEnterFrame(): void {
            // 当前时间流逝倍率不允许小于0
            if (this.$multiple < 0) {
                suncom.Logger.error(`当前时间流逝倍率不允许小于0`);
                return;
            }
            else if (this.$multiple === 0) {
                return;
            }
            // 获取帧间隔时间
            const delta: number = suncore.System.getDelta();
            // 若时间流逝倍率大于1，则需要进行追帧处理
            if (this.$multiples > 1) {

            }

            // 自定义帧事件
            this.$frameLoop();
        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         * export
         */
        protected abstract $frameLoop(): void;

        /**
         * 获取当前服务器时间戳
         */
        private $getCurrentServerTimestamp(): number {
            return this.$connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - this.$connection.clientTime;
        }

        /**
         * 对象过去的时间
         * export
         */
        get pastTime(): number {
            return this.$pastTime;
        }
    }
}