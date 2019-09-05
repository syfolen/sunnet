
module sunnet {

    /**
     * 网络连接象
     */
    export class NetConnection extends suncom.EventSystem implements INetConnection {
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
        private $pipeline: INetConnectionPipeline = new NetConnectionPipeline(this);

        constructor(name) {
            super();
            // 网络连接名字
            this.$name = name;
            // 消息处理管道
            this.$pipeline = new NetConnectionPipeline(this);
        }

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         */
        connect(ip: string, port: number, byDog: boolean): void {
            // 正常关闭连接
            if (byDog === false) {
                this.close(false);
            }
            // 被狗关闭的链接视为因网络错误而断开
            else {
                this.close(this.$closedByError);
            }

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
        }

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         */
        close(byError: boolean = false): void {
            // 主动断网
            if (byError === false) {
                this.$closedByError = false;
            }
            // 非正常断网时，若网络己处于连接状态，则标记为异常断开
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                // 更新标记
                this.$closedByError = true;
                // 清除队列消息
                this.dispatchEvent(EventKey.CLEAR_MESSAGE_QUEUE);
                // 异常断网时，需要通知
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 0);
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

            this.$state = NetConnectionStateEnum.DISCONNECTED;
        }

        /**
         * 发送二进制数据
         */
        send(buffer: ArrayBuffer): void {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(buffer);
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
         * 发送protobuf数据
         */
        sendPB(cmd: number, data?: any, ip?: string, port?: number): void {
            this.$pipeline.send(cmd, null, ip, port);
        }

        /**
         * 发送二进制数据
         */
        sendBytes(cmd: number, buffer: ArrayBuffer, ip?: string, port?: number): void {
            this.$pipeline.send(cmd, buffer, ip, port);
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
                puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 1);
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
            this.$pipeline.recv(null, null, null);
        }

        /**
         * 网络连接名称
         */
        get name(): string {
            return null;
        }

        /**
         * 服务器地址
         */
        get ip(): string {
            return this.$ip;
        }

        /**
         * 服务器端口
         */
        get port(): number {
            return this.$port;
        }

        /**
         * 网络连接状态
         */
        get state(): NetConnectionStateEnum {
            return this.$state;
        }

        /**
         * 数据接收缓冲区
         */
        get input(): Laya.Byte {
            return this.$socket.input;
        }

        /**
         * 数据发送缓冲区
         */
        get output(): Laya.Byte {
            return this.$socket.output;
        }

        /**
         * 获取消息管道对象
         */
        get pipeline(): INetConnectionPipeline {
            return this.$pipeline;
        }
    }
}