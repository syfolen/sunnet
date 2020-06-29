/**
 * @license sunnet (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunnet
 */
declare module sunnet {
    /**
     * MsgQId枚举（谨慎修改）
     * 说明：
     * 1. 请勿轻易修改此处的数据，否则可能会影响suncore中MsgQ的业务
     */
    enum MsgQIdEnum {
        /**
         * 发送数据
         */
        NSL_SEND_DATA = 1,

        /**
         * 接收数据
         */
        NSL_RECV_DATA = 2
    }

    /**
     * 网络状态枚举
     */
    enum NetConnectionStateEnum {
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
     * 服务端时间更新标记枚举
     */
    enum ServerTimeUpdateFlagEnum {
        /**
         * 重置
         */
        RESET,

        /**
         * 更新
         */
        UPDATE
    }

    /**
     * 网络环境模拟等级枚举
     */
    enum VirtualNetworkLevelEnum {
        /**
         * 无任何模拟
         */
        NONE,

        /**
         * 好
         */
        GOOD,

        /**
         * 差
         */
        BAD,

        /**
         * 极差
         */
        UNSTABLE
    }

    /**
     * 网络连接对象接口
     */
    interface INetConnection extends suncom.IEventSystem {
        /**
         * 网络连接状态
         */
        readonly state: NetConnectionStateEnum;

        /**
         * 获取消息管道对象
         */
        readonly pipeline: INetConnectionPipeline;

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         */
        connect(ip: string, port: number, byDog: boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为：false
         */
        close(byError?: boolean): void;

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         */
        sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;
    }

    /**
     * 网络消息拦截器接口
     */
    interface INetConnectionInterceptor extends puremvc.INotifier {

        /**
         * 数据发送拦截接口
         */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any>;

        /**
         * 数据接收拦截接口
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any>;
    }

    /**
     * 消息处理管道接口
     */
    interface INetConnectionPipeline extends INetConnectionInterceptor {

        /**
         * 新增责任处理者
         * 说明：
         * 1. 当网络发送数据时，后添加的拦截器先执行
         * 2. 当网络接收数据时，先添加的拦截器先执行
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void;

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void;
    }

    /**
     * 时序接口
     */
    interface ISequentialSlice extends puremvc.Notifier {

        /**
         * 释放时序片断
         */
        release(): void;
    }

    /**
     * 时间时序接口
     */
    interface ISequentialTimeSlice extends ISequentialSlice {
        /**
         * 时间流逝的倍率
         */
        timeMultiple: number;

        /**
         * 对象的生命时长
         */
        readonly timeLen: number;

        /**
         * 对象过去的时间
         */
        readonly pastTime: number;

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @pastTime: 默认过去时长
         * @chaseMultiple: 追帧时的时间倍率，默认为：1
         */
        updateCreateTime(createTime?: number, pastTime?: number, chaseMultiple?: number): void;
    }

    /**
     * 网络消息结构
     */
    interface ISocketMessage {
        /**
         * 消息ID
         */
        id?: number;

        /**
         * 消息名字
         */
        name: string;

        /**
         * 挂载的数据对象
         */
        data?: any;

        /**
         * 服务器地址
         */
        ip?: string;

        /**
         * 服务器端口
         */
        port?: number;
    }

    /**
     * 网络连接对象
     */
    class NetConnection extends puremvc.Notifier implements INetConnection, suncom.IEventSystem {

        constructor(name: string);

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
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         */
        sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;

        /**
         * 取消当前正在派发的事件
         */
        dispatchCancel(): void;

        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         */
        dispatchEvent(type: string, args?: any, cancelable?: boolean): void;

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为：suncom.EventPriorityEnum.LOW
         */
        addEventListener(type: string, method: Function, caller: Object, receiveOnce?: boolean, priority?: suncom.EventPriorityEnum): void;

        /**
         * 移除事件
         */
        removeEventListener(type: string, method: Function, caller: Object): void;

        /**
         * 网络连接状态
         */
        readonly state: NetConnectionStateEnum;

        /**
         * 获取消息管道对象
         */
        readonly pipeline: INetConnectionPipeline;
    }

    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     */
    abstract class NetConnectionInterceptor extends puremvc.Notifier implements INetConnectionInterceptor {

        constructor(connection: INetConnection);

        /**
         * 销毁拦截器
         */
        destroy(): void;

        /**
         * 网络连接成功
         */
        protected $onConnected(): void;

        /**
         * 网络连接断开
         */
        protected $onDisconnected(byError: boolean): void;

        /**
         * 数据发送拦截接口
         */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any>;

        /**
         * 数据接收拦截接口
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any>;
    }

    /**
     * 网络延时计算脚本
     */
    abstract class NetConnectionPing extends NetConnectionInterceptor {

        /**
         * 网络连接成功
         */
        protected $onConnected(): void;

        /**
         * 数据发送拦截接口
         */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any>;

        /**
         * 数据接收拦截接口
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any>;

        /**
         * 判断是否为可靠协议
         * 说明：
         * 1. 仅允许由客户端发起，且服务端必定会回复的协议视为可靠协议
         * 2. 若发送的协议为可靠协议，则会自动为其创建一个追踪器
         */
        protected abstract $isReliableProtocal(cmd: number): boolean;

        /**
         * 获取命令的应答协议号
         */
        protected abstract $getProtocalReplyCommand(cmd: number): number;

        /**
         * 处理接收到的数据
         */
        protected abstract $dealRecvData(cmd: number, data: any): void;

        /**
         * 更新服务器时间
         * 说明：
         * 1. 需要由继承类在$dealRecvData中调用来更新服务器时间相关的数据
         */
        protected $updateServerTimestamp(time: number, flag: ServerTimeUpdateFlagEnum): void;
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

        /**
         * 数据解析执行函数
         */
        protected abstract $decode(cmd: number, bytes: Uint8Array): any;
    }

    /**
     * 虚拟网络环境，用于模拟现实中的网络延迟，掉线等
     */
    class NetConnectionVirtualNetwork extends NetConnectionInterceptor {

        /**
         * 网络连接的可靠时间
         * 说明：
         * 1. 每次网络成功连接，经多少秒后强制断开
         */
        protected $getReliableTimeOfConnection(): number;

        /**
         * 网络延时波动概率（0-100）
         * 说明：
         * 1. 当网络发生波动时，延时会较大
         */
        protected $getProbabilyOfNetworkWave(): number;

        /**
         * 数据包的延时时间
         * 说明：
         * 1. 每新收到一个数据包，计算它应当被延时的时间
         */
        protected $calculateMessageDelayTime(): number;
    }

    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     */
    class NetConnectionWatchDog extends NetConnectionInterceptor {
    }

    /**
     * protobuf管理类
     */
    class ProtobufManager {

        static getInstance(): ProtobufManager;

        /**
         * 构建protobuf
         */
        buildProto(url: string): void;

        /**
         * 构建协议信息
         */
        buildProtocal(url: string): void;

        /**
         * 构建协议信息
         */
        buildProtocalJson(json: any): void;

        /**
         * 根据编号获取协议信息
         */
        getProtocalByCommand(cmd: any): any;

        /**
         * 根据名字获取协议信息
         */
        getProtocalByName(name: string): any;

        /**
         * 根据protobuf枚举定义
         */
        getProtoEnum(name: string): any;

        /**
         * 编码
         */
        encode(name: string, data: any): Uint8Array;

        /**
         * 解码
         */
        decode(name: string, bytes: Uint8Array): any;
    }

    /**
     * 时序片断
     */
    abstract class SequentialSlice extends puremvc.Notifier implements ISequentialSlice {

        /**
         * 释放时序片断
         */
        release(): void;

        private $onEnterFrameCB(): void;

        /**
         * 帧事件回调
         */
        protected abstract $onEnterFrame(): void;
    }

    /**
     * 时间片段
     */
    abstract class SequentialTimeSlice extends SequentialSlice implements ISequentialTimeSlice {
        /**
         * 时间流逝的倍率
         */
        timeMultiple: number;

        /**
         * @timeLen: 时间片断长度
         * @conName: 默认为"default"
         * 说明：
         * 1. 客户端对象是不需要追帧的
         */
        constructor(lifeTime: number, conName?: string);

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @pastTime: 默认过去时长
         * @chaseMultiple: 追帧时的时间倍率，默认为：1
         */
        updateCreateTime(createTime?: number, pastTime?: number, chaseMultiple?: number): void;

        /**
         * 帧事件回调（追帧算法实现函数）
         */
        protected $onEnterFrame(): void;

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         */
        protected abstract $frameLoop(): void;

        /**
         * 时间结束回调（回调前会先执行$frameLoop方法）
         */
        protected abstract $onTimeup(): void;

        /**
         * 对象的生命时长
         */
        readonly timeLen: number;

        /**
         * 对象过去的时间
         */
        readonly pastTime: number;
    }

    /**
     * 网络连接创建器
     */
    class NetConnectionCreator extends NetConnectionInterceptor {
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    class NetConnectionDecoder extends NetConnectionInterceptor {
    }

    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    class NetConnectionEncoder extends NetConnectionInterceptor {
    }

    /**
     * 心跳检测器
     */
    class NetConnectionHeartbeat extends NetConnectionInterceptor {
    }

    /**
     * 网络模块配置
     */
    namespace Config {
        /**
         * 服务端地址
         */
        let TCP_IP: string;

        /**
         * 服务端端口
         */
        let TCP_PORT: number;

        /**
         * 重连延时
         */
        let TCP_RETRY_DELAY: number;

        /**
         * 最大重连次数
         */
        let TCP_MAX_RETRIES: number;

        /**
         * 心跳发送指令
         */
        let HEARTBEAT_REQUEST_COMMAND: number;

        /**
         * 心跳接收指令
         */
        let HEARTBEAT_RESPONSE_COMMAND: number;

        /**
         * 心跳超时时间
         */
        let HEARTBEAT_TIMEOUT_MILLISECONDS: number;

        /**
         * 心跳间隔时间
         */
        let HEARTBEAT_INTERVAL_MILLISECONDS: number;

        /**
         * 以固定频率发送心跳，默认为：false
         * 说明：
         * 1. 若为true，则心跳的发送频率不受业务数据发送的影响
         * 2. 若为false，则有业务数据持续发送时，就不会发送心跳
         */
        let HEARTBEAT_FIXED_FREQUENCY: boolean;

        /**
         * 虚拟网络水平
         */
        let VIRTUAL_NETWORK_LEVEL: VirtualNetworkLevelEnum;
    }

    /**
     * 网络消息派发器
     */
    namespace MessageNotifier {

        /**
         * 通知网络消息
         */
        function notify(name: string, data: any, cancelable?: boolean): void;

        /**
         * 注册网络消息监听
         */
        function register(name: string, method: Function, caller: Object, priority?: number): void;

        /**
         * 移除网络消息监听
         */
        function unregister(name: string, method: Function, caller: Object): void;
    }

    /**
     * 网络模块消息定义
     */
    namespace NotifyKey {
        /**
         * 网络状态变化通知 { name: string, state: NetConnectionStateEnum, byError: boolean }
         */
        const SOCKET_STATE_CHANGE: string;

        /**
         * 网络连接失败（检测狗在尝试重连失败后会派发此消息）
         */
        const SOCKET_CONNECT_FAILED: string;
    }

    /**
     * 获取当前服务器时间戳
     */
    function getCurrentServerTimestamp(connName?: string): number;
}