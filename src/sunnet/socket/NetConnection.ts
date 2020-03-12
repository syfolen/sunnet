/**
 * @license sunnet (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunnet
 * export
 */
module sunnet {
    /**
     * 网络连接对象
     * export
     */
    export class NetConnection extends puremvc.Notifier implements suncom.IEventSystem {
        /**
         * 包头长度
         */
        static readonly HEAD_LENGTH: number = 28;

        /**
         * 网络连接名字
         */
        private $name: string;

        /**
         * 是否因为连接错误而关闭
         */
        private $closedByError: boolean = false;

        /**
         * 服务端地址
         */
        private $ip: string;

        /**
         * 服务端端口
         */
        private $port: number;

        /**
         * Socket对象
         */
        private $socket: Laya.Socket = null;

        /**
         * 连接状态
         */
        private $state: NetConnectionStateEnum = NetConnectionStateEnum.DISCONNECTED;

        /**
         * 网络消息管道
         */
        private $pipeline: INetConnectionPipeline = null;

        /**
         * 实现事件系统接口
         */
        private $dispatcher: suncom.IEventSystem = null;

        /**
         * export
         */
        constructor(name: string) {
            super(suncore.MsgQModEnum.NSL);
            this.$name = name;
            this.$pipeline = new NetConnectionPipeline(this);
            this.$dispatcher = new suncom.EventSystem();
        }

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         * export
         */
        connect(ip: string, port: number, byDog: boolean): void {
            const byError: boolean = byDog === false ? false : this.$closedByError;
            this.close(byError);

            this.$ip = ip;
            this.$port = port;
            this.$state = NetConnectionStateEnum.CONNECTING;

            this.$socket = new Laya.Socket();
            this.$socket.endian = Laya.Byte.LITTLE_ENDIAN;
            this.$socket.on(Laya.Event.OPEN, this, this.$onOpen);
            this.$socket.on(Laya.Event.CLOSE, this, this.$onClose);
            this.$socket.on(Laya.Event.ERROR, this, this.$onError);
            this.$socket.on(Laya.Event.MESSAGE, this, this.$onMessage);
            this.$socket.connectByUrl("ws://" + ip + ":" + port);

            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`Netconnection=> 请求连接 ws://${this.$ip}:${this.$port}`);
            }
            // 通知网络状态变更
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
        }

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         * export
         */
        close(byError: boolean = false): void {
            // 主动断网
            if (byError === false) {
                this.$closedByError = false;
            }
            // 非正常断网时，若网络己处于连接状态，则标记为异常断开
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$closedByError = true;
                this.dispatchEvent(EventKey.CLEAR_MESSAGE_QUEUE);
            }

            if (this.$socket !== null) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(`Netconnection=> 关闭连接 ws://${this.$ip}:${this.$port}`);
                }

                // 清除 socket 事件侦听
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);

                // 关闭 socket
                this.$socket.close();
                this.$socket = null;
            }

            // 若当前网络未处于断开状态，则派发网络断开事件
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(EventKey.SOCKET_DISCONNECTED, byError);
            }

            // 非异常断网时，不需要自动重连
            if (byError === false) {
                this.dispatchEvent(EventKey.KILL_WATCH_DOG);
            }

            // 通知网络状态变更
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.$state = NetConnectionStateEnum.DISCONNECTED;
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
            }
        }

        /**
         * 发送二进制数据
         */
        send(bytes: Uint8Array): void {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        }

        /**
         * 发送数据
         */
        flush(): void {
            this.$socket.flush();
        }

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         * @care: 心跳是否会关心此协议，默认为true
         * export
         */
        sendBytes(cmd: number, bytes: Uint8Array = null, ip: string = null, port: number = 0, care: boolean = true): void {
            this.$pipeline.send(cmd, bytes, ip, port, care);
        }

        /**
         * 连接成功
         */
        private $onOpen(): void {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }

            // 若是异常断网成功重连，则需要通知网络状态变更
            if (this.$closedByError === true) {
                this.$closedByError = false;
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
            }

            // 网络重连成功
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);
        }

        /**
         * 连接断开
         */
        private $onClose(): void {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        }

        /**
         * 连接异常
         */
        private $onError(): void {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常断开！");
            }
            this.close(true);
        }

        /**
         * 响应数据
         */
        private $onMessage(event: Laya.Event): void {
            this.$pipeline.recv(0, 0, null, void 0);
        }

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
         * @priority: 事件优先级，优先级高的先被执行，默认为 1
         * export
         */
        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: number): void {
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
            return this.$name;
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
            const socket: Laya.Socket = this.$socket || null;
            if (socket === null) {
                return null;
            }
            return this.$socket.input || null;
        }

        /**
         * 数据发送缓冲区
         */
        get output(): Laya.Byte {
            const socket: Laya.Socket = this.$socket || null;
            if (socket === null) {
                return null;
            }
            return this.$socket.output || null;
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