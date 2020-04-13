
module sunnet {
    /**
     * 网络连接抽象类
     * export
     */
    export abstract class NetConnectionAdapter extends puremvc.Notifier implements INetConnection, suncom.IEventSystem {
        /**
         * 网络连接名字
         */
        protected $name: string;

        /**
         * 服务端地址
         */
        protected $ip: string;

        /**
         * 服务端端口
         */
        protected $port: number;

        /**
         * 连接状态
         */
        protected $state: NetConnectionStateEnum = NetConnectionStateEnum.DISCONNECTED;

        /**
         * Socket对象
         */
        protected $socket: Laya.Socket = null;

        /**
         * Ping值
         */
        protected $ping: number = 0;

        /**
         * 网络推算延迟
         */
        protected $latency: number = 0;

        /**
         * 服务器时间 
         */
        protected $srvTime: number = 0;

        /**
         * 客户端时间
         */
        protected $clientTime: number = 0;

        /**
         * 网络消息管道
         */
        protected $pipeline: INetConnectionPipeline = null;

        /**
         * 实现事件系统接口
         */
        protected $dispatcher: suncom.IEventSystem = new suncom.EventSystem();

        /**
         * export
         */
        constructor(name: string) {
            super(suncore.MsgQModEnum.NSL);
            this.$name = name;
            this.$pipeline = new NetConnectionPipeline(this);
            M.connetionMap[name] = this;
        }

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         * export
         */
        abstract connect(ip: string, port: number, byDog: boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         * export
         */
        abstract close(byError?: boolean): void;

        /**
         * 发送二进制数据
         */
        abstract send(bytes: Uint8Array): void;

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         * export
         */
        abstract sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;

        /**
         * 发送数据
         */
        abstract flush(): void;

        /**
         * 取消当前正在派发的事件
         * export
         */
        dispatchCancel(): void {
            this.$dispatcher.dispatchCancel();
        }

        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         * export
         */
        dispatchEvent(type: string, args?: any, cancelable?: boolean): void {
            this.$dispatcher.dispatchEvent(type, args, cancelable);
        }

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为：suncom.EventPriorityEnum.LOW
         * export
         */
        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum): void {
            this.$dispatcher.addEventListener(type, method, caller, receiveOnce, priority);
        }

        /**
         * 移除事件
         * export
         */
        removeEventListener(type: string, method: Function, caller: Object): void {
            this.$dispatcher.removeEventListener(type, method, caller);
        }

        /**
         * 网络连接名称
         */
        get name(): string {
            return this.$name || null;
        }

        /**
         * 服务器地址
         */
        get ip(): string {
            return this.$ip || null;
        }

        /**
         * 服务器端口
         */
        get port(): number {
            return this.$port || 0;
        }

        /**
         * 网络连接状态
         * export
         */
        get state(): NetConnectionStateEnum {
            return this.$state;
        }

        /**
         * 数据接收缓冲区
         */
        get input(): Laya.Byte {
            if (this.$socket === null) {
                return null;
            }
            else {
                return this.$socket.input || null;
            }
        }

        /**
         * 数据发送缓冲区
         */
        get output(): Laya.Byte {
            if (this.$socket === null) {
                return null;
            }
            else {
                return this.$socket.output || null;
            }
        }

        /**
         * Ping值
         */
        get ping(): number {
            return this.$ping;
        }
        set ping(value: number) {
            this.$ping = value;
        }

        /**
         * 网络推算延时
         */
        get latency(): number {
            return this.$latency;
        }
        set latency(value: number) {
            this.$latency = value;
        }

        /**
         * 服务器时间 
         */
        get srvTime(): number {
            return this.$srvTime;
        }
        set srvTime(value: number) {
            this.$srvTime = value;
        }

        /**
         * 客户端时间
         */
        get clientTime(): number {
            return this.$clientTime;
        }
        set clientTime(value: number) {
            this.$clientTime = value;
        }

        /**
         * 获取消息管道对象
         * export
         */
        get pipeline(): INetConnectionPipeline {
            return this.$pipeline;
        }
    }
}