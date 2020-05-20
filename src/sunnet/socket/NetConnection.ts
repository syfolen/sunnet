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
    export class NetConnection extends puremvc.Notifier implements INetConnection, suncom.IEventSystem {
        /**
         * 网络连接名字
         */
        private $name: string;

        /**
         * 哈希ID，每个连接的哈希ID都是唯一的 
         */
        private $hashId: number = 0;

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
         * 网络消息管道
         */
        private $pipeline: INetConnectionPipeline = null;

        /**
         * 连接状态
         */
        private $state: NetConnectionStateEnum = NetConnectionStateEnum.DISCONNECTED;

        /**
         * 是否因为连接错误而关闭
         */
        private $closedByError: boolean = false;

        /**
         * Ping值
         */
        private $ping: number = 0;

        /**
         * 网络推算延迟
         */
        private $latency: number = 0;

        /**
         * 服务器时间 
         */
        private $srvTime: number = 0;

        /**
         * 客户端时间
         */
        private $clientTime: number = 0;

        /**
         * 实现事件系统接口
         */
        private $dispatcher: suncom.IEventSystem = new suncom.EventSystem();

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
            this.$hashId = suncom.Common.createHashId();

            if ((suncom.Global.debugMode & suncom.DebugMode.TEST) && suncom.Test.ENABLE_MICRO_SERVER === true) {

            }
            else {
                this.$socket.connectByUrl("ws://" + ip + ":" + port);
            }

            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, `Netconnection=> 请求连接 ws://${this.$ip}:${this.$port}`);
            }
            // 模拟断开网络
            this.addEventListener(EventKey.CLOSE_CONNECT_BY_VIRTUAL, this.$onError, this);
            // 通知网络状态变更
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, false]);
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
                this.dispatchEvent(EventKey.CLEAR_REQUEST_DATA);
            }

            if (this.$socket !== null) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, `Netconnection=> 关闭连接 ws://${this.$ip}:${this.$port}`);
                }

                // 清除 socket 事件侦听
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);

                // 关闭 socket
                this.$socket.close();
                this.$socket = null;
                this.$hashId = 0;
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
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, byError]);
            }
        }

        /**
         * 发送二进制数据
         */
        send(bytes: Uint8Array): void {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            else {
                suncom.Logger.error(suncom.DebugMode.ANY, "NetConnection=> 网络未连接，发送数据失败！！！");
            }
        }

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         * export
         */
        sendBytes(cmd: number, bytes: Uint8Array = null, ip: string = null, port: number = 0): void {
            this.$pipeline.send(cmd, bytes, ip, port);
        }

        /**
         * 发送数据
         */
        flush(): void {
            this.$socket.flush();
        }

        /**
         * 获取当前服务器时间戳
         */
        getCurrentServerTimestamp(): number {
            return this.$srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - this.$clientTime;
        }

        /**
         * 连接状态测试接口
         */
        testChangeState(state: MSWSStateEnum): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onTestChangeState, [this.$hashId, state]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        }

        /**
         * 连接状态测试执行函数
         */
        private $onTestChangeState(hashId: number, state: MSWSStateEnum): void {
            if (this.$hashId === hashId) {
                if (state === MSWSStateEnum.CONNECTED) {
                    this.$onOpen();
                }
                else if (state === MSWSStateEnum.CLOSE) {
                    this.$onClose();
                }
                else if (state === MSWSStateEnum.ERROR) {
                    this.$onError();
                }
            }
        }

        /**
         * 测试数据包上行
         */
        testPacket(cmd: number): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onTestPacket, [this.$hashId, cmd]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        }

        /**
         * 测试数据包下行执行函数
         */
        private $onTestPacket(hashId: number, cmd: number): void {
            if (this.$hashId === hashId) {
                this.facade.sendNotification(suncom.NotifyKey.TEST_RECV, cmd);
            }
        }

        /**
         * 测试协议下行
         */
        testProtocal(name: string, data: any): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                const handler: suncom.IHandler = suncom.Handler.create(this, this.$onTestProtocal, [this.$hashId, name, data]);
                suncore.System.addMessage(suncore.ModuleEnum.SYSTEM, suncore.MessagePriorityEnum.PRIORITY_0, handler);
            }
        }

        /**
         * 测试数据包下行执行函数
         */
        private $onTestProtocal(hashId: number, name: string, data: any): void {
            if (this.$hashId === hashId) {
                const protocal: { Id: number } = ProtobufManager.getInstance().getProtocalByName(name);
                this.$pipeline.recv(protocal.Id, 0, null, data);
            }
        }

        /**
         * 打印数据己发送的消息
         */
        logMsgIsSent(cmd: number, bytes: Uint8Array, ip: string, port: number): void {
            const protocal: { Name: string } = ProtobufManager.getInstance().getProtocalByCommand(cmd);
            const data: any = protocal === null ? null : ProtobufManager.getInstance().decode("msg." + protocal.Name, bytes);
            if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, `发送心跳 name:${protocal.Name}, data:${JSON.stringify(data)}`);
                }
            }
            else if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, `发送消息 name:${protocal.Name}, data:${JSON.stringify(data)}`);
            }
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
         * 连接成功
         */
        private $onOpen(): void {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 网络连接成功！");
            }
            // 网络重连成功
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);

            // 不再缓存正在发送的数据流
            this.dispatchEvent(EventKey.CACHE_SEND_BYTES, false);
            // 发送所有当前己缓存的数据流
            this.dispatchEvent(EventKey.FLUSH_CACHED_BYTES);

            // 重置异常关闭的标记
            this.$closedByError = false;
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state, false]);
        }

        /**
         * 连接断开
         */
        private $onClose(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        }

        /**
         * 连接异常
         */
        private $onError(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(suncom.DebugMode.ANY, "Netconnection=> 连接异常断开！");
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