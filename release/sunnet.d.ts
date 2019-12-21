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
        NET_SEND_DATA = suncore.MsgQIdEnum.NET_MSG_ID_BEGIN,

        /**
         * 接收数据
         */
        NET_RECV_DATA
    }

    /**
     * 网络状态枚举
     */
    enum NetConnectionStateEnum {
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
         * @byError: 是否因为网络错误而关闭，默认为false
         */
        close(byError?: boolean): void;

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array
         * @ip: 目标地址，允许为空
         * @port: 目标端口，允许为空
         */
        sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;
    }

    /**
     * 网络消息拦截器接口
     */
    interface INetConnectionInterceptor {
    }

    /**
     * 消息处理管道接口
     */
    interface INetConnectionPipeline {

        /**
         * 新增责任处理者
         */
        add(arg0: string | (new (connection: INetConnection) => INetConnectionInterceptor), arg1?: new (connection: INetConnection) => INetConnectionInterceptor): void;

        /**
         * 移除责任处理责
         * @cls: 需要被移除的类型
         */
        remove(cls: new (connection: INetConnection) => INetConnectionInterceptor): void;
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
     * 网络连接象
     */
    class NetConnection extends puremvc.Notifier implements suncom.IEventSystem {

        constructor(name:string);

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         */
        connect(ip:string, port:number, byDog:boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         */
        close(byError?:boolean): void;

        /**
         * 发送二进制数据
         */
        sendBytes(cmd:number, bytes?:Uint8Array, ip?:string, port?:number): void;

        /**
         * 取消当前正在派发的事件
         */
        dispatchCancel(): void;

        /**
         * 事件派发
         * @args[]: 参数列表，允许为任意类型的数据
         * @cancelable: 事件是否允许被中断，默认为false
         */
        dispatchEvent(type:string, args?:any, cancelable?:boolean): void;

        /**
         * 事件注册
         * @receiveOnce: 是否只响应一次，默认为false
         * @priority: 事件优先级，优先级高的先被执行，默认为 1
         */
        addEventListener(type:string, method:Function, caller:Object, receiveOnce?:boolean, priority?:number): void;

        /**
         * 移除事件
         */
        removeEventListener(type:string, method:Function, caller:Object): void;

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

        constructor(connection:INetConnection);
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

        /**
         * 数据解析执行函数
         */
        protected abstract $decode(cmd:number, bytes:Uint8Array): any;
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
        buildProto(url:string): void;

        /**
         * 构建协议信息
         */
        buildProtocal(url:string): void;

        /**
         * 构建协议信息
         */
        buildProtocalJson(json:any): void;

        /**
         * 根据编号获取协议信息
         */
        getProtocalByCommand(cmd:any): any;

        /**
         * 根据名字获取协议信息
         */
        getProtocalByName(name:string): any;

        /**
         * 根据protobuf枚举定义
         */
        getProtoEnum(name:string): any;

        /**
         * 编码
         */
        encode(name:string, data:any): Uint8Array;

        /**
         * 解码
         */
        decode(name:string, bytes:Uint8Array): any;
    }

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
    class NetConnectionHeartBeat extends NetConnectionInterceptor {
    }

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
        let TCP_MAX_RETRY_TIME: number;

        /**
         * 心跳发送指令
         */
        let HEARTBEAT_REQUEST_COMMAND: number;

        /**
         * 心跳接收指令
         */
        let HEARTBEAT_RESPONSE_COMMAND: number;
    }

    /**
     * 网络消息派发器
     */
    namespace MessageNotifier {

        /**
         * 通知网络消息
         */
        function notify(name: string, data: any): void;

        /**
         * 注册网络消息监听
         */
        function register(name: string, method: Function, caller: Object): void;

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
         * 网络状态变化
         */
        const SOCKET_STATE_CHANGE: string;

        /**
         * 网络异常通知
         */
        const SOCKET_STATE_ANOMALY: string;

        /**
         * 网络重连通知
         */
        const SOCKET_RETRY_CONNECT: string;
    }
}