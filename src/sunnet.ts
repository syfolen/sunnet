export module sunnet {

    export enum HeartbeatCommandEnum {

        /**
         * 请求
         */
        REQUEST = -1,

        /**
         * 回复
         */
        RESPONSE = -2
    }

    /**
     * 网络状态枚举
     */
    export enum NetConnectionStateEnum {
        /**
         * 己连接
         */
        CONNECTED = 0,

        /**
         * 正在连接
         */
        CONNECTING,

        /**
         * 己断开
         */
        DISCONNECTED
    }

    /**
     * 网络连接对象接口
     */
    export interface INetConnection extends suncom.IEventSystem {

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         */
        connect(ip: string, port: number, byDog: boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         */
        close(byError?: boolean): void;

        /**
         * 发送二进制数据
         */
        send(bytes: Uint8Array): void;

        /**
         * 发送数据
         */
        flush(): void;

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array
         * @ip: 目标地址，允许为空 
         * @port: 目标端口，允许为空
         */
        sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;

        /**
         * 网络连接名称
         */
        readonly name: string;

        /**
         * 服务器地址
         */
        readonly ip: string;

        /**
         * 服务器端口
         */
        readonly port: number;

        /**
         * 网络连接状态
         */
        readonly state: NetConnectionStateEnum;

        /**
         * 数据接收缓冲区
         */
        readonly input: Laya.Byte;

        /**
         * 数据发送缓冲区
         */
        readonly output: Laya.Byte;

        /**
         * 获取消息管道对象
         */
        readonly pipeline: INetConnectionPipeline;
    }

    /**
     * 网络消息拦截器接口
     */
    export interface INetConnectionInterceptor {

        /**
         * 销毁拦截器
         */
        destroy(): void;

        /**
         * 数据发送拦截接口
         */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any>;

        /**
         * 数据接收拦截接口
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any>;
    }

    /**
     * 消息处理管道接口
     */
    export interface INetConnectionPipeline {

        /**
         * 新增责任处理者
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void;

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void;

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any>;

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any>;
    }

    /**
     * 网络消息管道拦截器信息
     */
    export interface INetConnectionPipelineItem {
        /**
         * 类型
         */
        type?: string;

        /**
         * 拦截器
         */
        interceptor: INetConnectionInterceptor;
    }

    export interface ISocketData {
        /**
         * 协议号
         */
        cmd: number;

        /**
         * 数据流
         */
        bytes: Uint8Array;

        /**
         * 服务器地址
         */
        ip: string;

        /**
         * 服务器端口
         */
        port: number;
    }

	export abstract class Config {

		/**
		 * 服务端地址
		 */
		static TCP_IP: string;

		/**
		 * 服务端端口
		 */
		static TCP_PORT: number;

		/**
		 * 重连延时
		 */
		static TCP_RETRY_DELAY: number = 20 * 1000;

		/**
		 * 最大重连次数
		 */
		static TCP_MAX_RETRY_TIME: number = 10;
	}


    export abstract class EventKey {
        // 网络己连接
        static readonly SOCKET_CONNECTED: string = "sunnet.EventKey.SOCKET_CONNECTED";
        // 网络己断开
        static readonly SOCKET_DISCONNECTED: string = "sunnet.EventKey.SOCKET_DISCONNECTED";

        // 杀死检测狗
        static readonly KILL_WATCH_DOG: string = "sunnet.EventKey.KILL_WATCH_DOG";
        // 清空未发送的网络消息队列
        static readonly CLEAR_MESSAGE_QUEUE: string = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
    }

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

        constructor(name: string) {
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
         * 发送二进制数据
         */
        sendBytes(cmd: number, bytes: Uint8Array = null, ip?: string, port?: number): void {
            this.$pipeline.send(cmd, bytes, ip, port);
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

    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     */
    export abstract class NetConnectionInterceptor implements INetConnectionInterceptor {

        protected $connection: INetConnection;

        constructor(connection: INetConnection) {
            this.$connection = connection;
            this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
        }

        /**
         * 销毁拦截器
         */
        destroy(): void {
            this.$connection.removeEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        }

        /**
         * 网络连接成功
         */
        protected $onConnected(): void {

        }

        /**
         * 网络连接断开
         */
        protected $onDisconnected(byError: boolean): void {

        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any> {
            return [cmd, bytes, ip, port];
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            return [cmd, srvId, bytes, data];
        }
    }

    /**
     * 消息处理管道
     * 此类以责任链模式处理即将发送或己接收的网络数据，专门为 core.NetConnection 服务
     */
    export class NetConnectionPipeline extends NetConnectionInterceptor implements INetConnectionPipeline {

        /**
         * 拦截器列表
         */
        private $items: Array<INetConnectionPipelineItem> = [];

        /**
         * 新增责任处理者
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void {
            const item: INetConnectionPipelineItem = new NetConnectionPipelineItem();

            item.type = typeof arg0 === "string" ? arg0 : null;
            item.interceptor = typeof arg0 !== "string" ? new arg0(this.$connection) : new arg1(this.$connection);

            this.$items.push(item);
        }

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void {
            for (let i: number = 0; i < this.$items.length; i++) {
                const interceptor: INetConnectionInterceptor = this.$items[i].interceptor;
                if (interceptor instanceof cls) {
                    this.$items.splice(i, 1);
                    interceptor.destroy();
                    break;
                }
            }
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            let params: Array<any> = [cmd, srvId, bytes, data];

            // 数据将保持传递，直至处理完毕，或返回 null
            for (let i: number = 0; i < this.$items.length; i++) {
                const item: INetConnectionPipelineItem = this.$items[i];
                if (item.type === "send") {
                    continue;
                }
                const interceptor: INetConnectionInterceptor = item.interceptor;
                params = interceptor.recv.apply(interceptor, params);
                if (params === null) {
                    return;
                }
            }

            // 消息解析失败
            if (params[3] === void 0) {
                if (suncom.Global.debugMode) {
                    suncom.Logger.warn(`NetConnectionPipeline=> decode 意外的指令 cmd:${params[0].toString()}, buff:${params[1] ? "[Object]" : "null"}`);
                }
            }
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any> {
            for (let i: number = this.$items.length - 1; i > -1; i--) {
                // 数据将保持传递，直至处理完毕
                const item: INetConnectionPipelineItem = this.$items[i];
                if (item.type === "recv") {
                    continue;
                }
                const interceptor: INetConnectionInterceptor = item.interceptor;
                const res = interceptor.send.call(interceptor, cmd, bytes, ip, port);
                if (res === null) {
                    return null;
                }
            }
            return null;
        }
    }

    /**
     * 网络消息管道拦截器
     */
    export class NetConnectionPipelineItem implements INetConnectionPipelineItem {

        /**
         * 类型
         */
        type?: string;

        /**
         * 拦截器
         */
        interceptor: INetConnectionInterceptor;
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            // 若 data 不为 void 0 ，则说明己处理
            if (data !== void 0) {
                return [cmd, srvId, bytes, data];
            }
            // 消息解析失败时返回 null
            const newData: any = this.$decode(cmd, bytes);
            if (newData === null) {
                return [cmd, srvId, bytes, data];
            }
            suncom.Logger.log("消息解析成功 ==> " + JSON.stringify(newData));
            if (newData === bytes) {
                throw Error("请勿返回未处理的消息！！！");
            }
            // 消息解析成功，需要将cmd转化为name才能让消息进入队列
            const protocal = ProtobufManager.getInstance().getProtocalByCommand(cmd);
            suncore.System.addSocketMessage(protocal.Name, newData);
            // 消息解析成功
            return [cmd, srvId, bytes, newData];
        }

        /**
         * 数据解析执行函数
         */
        protected abstract $decode(cmd: number, bytes: Uint8Array): any;
    }

    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     */
    export class NetConnectionWatchDog extends NetConnectionInterceptor {

        /**
         * 重连定时器
         */
        private $timerId: number;

        /**
         * 重连的服务器地址
         */
        private $ip: string;

        /**
         * 重连的服务器端口
         */
        private $port: number;

        /**
         * 重连次数
         */
        private $retryCount: number = 0;

        constructor(connection: INetConnection) {
            super(connection);
            this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
        }

        /**
         * 销毁拦截器
         */
        destroy(): void {
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            super.destroy();
        }

        /**
         * 当网络连接被建立时，需要移除检测狗
         */
        protected $onConnected(): void {
            this.$retryCount = 0;
            this.$onKillWatchDog();
        }

        /**
         * 网络连接断开回调，若因异常断开，则在1000毫秒后开始重连
         */
        protected $onDisconnected(byError: boolean): void {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`NetConnectionWatchDog=> 网络连接异常，1000毫秒后重连！`);
                }
                if (this.$retryCount >= Config.TCP_MAX_RETRY_TIME) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 2);
                    return;
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, Config.TCP_RETRY_DELAY, this.$onDoingConnect, this);
            }
        }

        /**
         * 杀死检测狗
         */
        protected $onKillWatchDog(): void {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        }

        /**
         * 重连
         */
        private $onDoingConnect(): void {
            // 只有在网络处于未连接状态时才会进行重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$retryCount++;
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("检测狗不能正常工作，因为：", "state:" + suncom.Common.convertEnumToString(this.$connection.state, NetConnectionStateEnum));
                }
            }
        }
    }

    export abstract class NotifyKey {
        // 网络状态变化 
        static readonly SOCKET_STATE_CHANGE: string = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
    }

    /**
     * protobuf管理类
     */
    export class ProtobufManager {
        /**
         * 单例对象
         */
        private static instance: ProtobufManager = new ProtobufManager();

        static getInstance(): ProtobufManager {
            return ProtobufManager.instance;
        }

        /**
         * Protobuf定义
         */
        private $proto: any = null;

        /**
         * 命令集合
         */
        private $commands: Array<string> = null;

        /**
         * 协议信息集合
         */
        private $protocals: any = null;

        /**
         * 构建protobuf
         */
        buildProto(url: string): void {
            const root = new Laya.Browser.window.protobuf.Root();
            const protostr = Laya.loader.getRes(url);
            Laya.Browser.window.protobuf.parse(protostr, root, { keepCase: true });
            this.$proto = root;
        }

        /**
         * 构建协议信息
         */
        buildProtocal(url: string): void {
            const json = Laya.loader.getRes(url);
            this.$commands = Object.keys(json.data);
            this.$protocals = json.data;
        }

        /**
         * 根据编号获取协议信息
         */
        getProtocalByCommand(cmd): any {
            return this.$protocals[cmd] || null;
        }

        /**
         * 根据名字获取协议信息
         */
        getProtocalByName(name: string): any {
            for (let i = 0; i < this.$commands.length; i++) {
                const command = this.$commands[i];
                const protocal = this.getProtocalByCommand(command);
                if (protocal === null) {
                    continue;
                }
                if (protocal.Name === name) {
                    return protocal;
                }
            }
            return null;
        }

        /**
         * 获取protobuf定义
         */
        getProtoClass(name: string): any {
            return this.$proto.lookup(name);
        }

        /**
         * 根据protobuf枚举定义
         */
        getProtoEnum(name) {
            return this.getProtoClass(name).values;
        }

        /**
         * 编码
         */
        encode(name: string, data: any): Uint8Array {
            console.log(`打包数据成功 ==> ${JSON.stringify(data)}`);
            return this.getProtoClass(name).encode(data).finish();
        }

        /**
         * 解码
         */
        decode(name: string, bytes: Uint8Array): any {
            return this.getProtoClass(name).decode(bytes);
        }
    }

    export class NetConnectionCreator extends NetConnectionInterceptor {

        /**
         * 等待发送的消息队列
         */
        private $messages: Array<ISocketData> = [];

        constructor(connection: INetConnection) {
            super(connection);
            this.$connection.addEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
        }

        destroy(): void {
            this.$connection.removeEventListener(EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
            super.destroy();
        }

        /**
         * 网络连接成功回调
         */
        protected $onConnected(): void {
            while (this.$messages.length) {
                const data: ISocketData = this.$messages.pop();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        }

        /**
         * 清除所有网络消息缓存
         */
        private $onClearMessageQueue(): void {
            this.$messages.length = 0;
        }

        /**
         * 是否需要重连
         */
        private $needCreate(ip: string, port: number): boolean {
            // 若网络未连接，则需要重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            // 若网络己连接
            if (this.$connection.state === NetConnectionStateEnum.CONNECTED) {
                // 若IP和PORT有效且与请求的数据不一致，则需要重连
                if (ip !== void 0 && port !== void 0 && this.$connection.ip !== ip && this.$connection.port !== port) {
                    return true;
                }
            }
            // 否则不需要重连
            return false;
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any> {
            if (this.$needCreate(ip, port) == false) {
                // 网络尚未成功连接
                if (this.$connection.state === NetConnectionStateEnum.CONNECTING) {
                    return null;
                }
                return [cmd, bytes, ip, port];
            }
            this.$connection.connect(ip, port, false);

            const data: ISocketData = {
                cmd: cmd,
                bytes: bytes,
                ip: ip,
                port: port
            };
            this.$messages.push(data);

            return null;
        }
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export class NetConnectionDecoder extends NetConnectionInterceptor {

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            const input: Laya.Byte = this.$connection.input;

            cmd = input.getUint16();
            srvId = input.getUint16();

            const buffer = input.buffer.slice(input.pos);
            input.pos += buffer.byteLength;

            bytes = new Uint8Array(buffer);

            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + bytes.byteLength);
                }
            }

            // 清除缓冲区中的数据
            // input.clear();

            return [cmd, srvId, bytes, data];
        }
    }

    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    export class NetConnectionEncoder extends NetConnectionInterceptor {

		/**
		 * 拦截数据
		 */
        send(cmd: number, bytes: Uint8Array, ip?: string, port?: number): Array<any> {
            const output: Laya.Byte = this.$connection.output;

            // 写入包头
            output.writeUint16(cmd);
            output.writeUint16(0);

            // 写入包体，这里实际上可以直接写入Uint8Array
            bytes !== null && output.writeArrayBuffer(bytes);
            this.$connection.flush();

            if (cmd === HeartbeatCommandEnum.REQUEST) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`发送数据 cmd:${cmd.toString()}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
                }
            }
            else if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`发送数据 cmd:${cmd.toString()}, bytes:${bytes === null ? 0 : bytes.byteLength}`);
            }

            return null;
        }
    }

    /**
     * 心跳检测器
     */
    export class NetConnectionHeartBeat extends NetConnectionInterceptor {

        /**
         * 上次发送数据的时间
         */
        private $lastSendTime: number;

        /**
         * 上次接收数据的时间
         */
        private $lastRecvTime: number;

		/**
		 * 当网络成功连接时，开始心跳
		 */
        protected $onConnected(): void {
            this.$lastRecvTime = this.$lastSendTime = new Date().valueOf();
            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

		/**
		 * 连接断开后不再发送心跳
		 */
        protected $onDisconnected(): void {
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

		/**
		 * 心跳验证
		 */
        private $onEnterFrame(): void {
            const timestamp: number = suncore.System.engine.getTime();
            // 心跳未回复
            if (this.$lastRecvTime < this.$lastSendTime) {
                // 若时间己超过6秒，则视为网络掉线
                if (timestamp - this.$lastSendTime > 6000) {
                    // 更新最新接收消息的时间，防止任务连续被派发
                    this.$lastRecvTime = this.$lastSendTime;
                    // 强行关闭网络连接
                    this.$connection.close(true);
                }
            }
            // 若心跳己回复，则5秒后再次发送心跳
            else if (timestamp - this.$lastSendTime > 5000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                // 记录心跳被发送的时间
                this.$lastSendTime = timestamp;
                // 发送心跳
                this.$connection.sendBytes(HeartbeatCommandEnum.REQUEST);
            }
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            if (cmd === HeartbeatCommandEnum.RESPONSE) {
                // 记录心跳响应的时间
                this.$lastRecvTime = suncore.System.engine.getTime();
            }
            return [cmd, srvId, bytes, data];
        }
    }

}
