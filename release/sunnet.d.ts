declare module sunnet {

    export enum HeartbeatCommandEnum {

        /**
         * 请求
         */
        REQUEST = 0,

        /**
         * 回复
         */
        RESPONSE
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
        send(buffer: ArrayBuffer): void;

        /**
         * 发送数据
         */
        flush(): void;

        /**
         * 发送protobuf数据
         * @data: 只能是protobuf
         * @ip: 目标地址，允许为空 
         * @port: 目标端口，允许为空
         */
        sendPB(cmd: number, data?: any, ip?: string, port?: number): void;

        /**
         * 发送protobuf数据
         * @bytes: 只能是ArrayBuffer
         * @ip: 目标地址，允许为空 
         * @port: 目标端口，允许为空
         */
        sendBytes(cmd: number, bytes: ArrayBuffer, ip?: string, port?: number): void;

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
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any>;

        /**
         * 数据接收拦截接口
         */
        recv(cmd: number, srvId: number, buffer: ArrayBuffer, data?: any): Array<any>;
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
        recv(cmd: number, srvId: number, buffer: any, data?: any): Array<any>;

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any>;
    }

    export interface ISocketData {
        /**
         * 协议号
         */
        cmd: number;

        /**
         * 数据流
         */
        bytes: ArrayBuffer;

        /**
         * 服务器地址
         */
        ip: string;

        /**
         * 服务器端口
         */
        port: number;
    }

    export abstract class EventKey {
        // 网络己连接
        static readonly SOCKET_CONNECTED: string;
        // 网络己断开
        static readonly SOCKET_DISCONNECTED: string;
    }

    /**
     * 网络连接象
     */
    export class NetConnection extends suncom.EventSystem implements INetConnection {

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
         * 发送二进制数据
         */
        send(buffer: ArrayBuffer): void;

        /**
         * 发送数据
         */
        flush(): void;

        /**
         * 发送protobuf数据
         */
        sendPB(cmd: number, data?: any, ip?: string, port?: number): void;

        /**
         * 发送二进制数据
         */
        sendBytes(cmd: number, buffer: ArrayBuffer, ip?: string, port?: number): void;

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
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     */
    export abstract class NetConnectionInterceptor implements INetConnectionInterceptor {

        protected $connection: INetConnection;

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
        send(cmd: number, bytes?: ArrayBuffer, ip?: string, port?: number): Array<any>;

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, buffer: any, data?: any): Array<any>;
    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export abstract class NetConnectionProtobufDecoder extends NetConnectionInterceptor {

        /**
         * 数据解析执行函数
         */
        protected abstract $decode(cmd: number, buffer: ArrayBuffer): any;
    }

    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     */
    export class NetConnectionWatchDog extends NetConnectionInterceptor {

    }

    export abstract class NotifyKey {
        // 网络状态变化 
        static readonly SOCKET_STATE_CHANGE: string;
    }

    /**
     * protobuf管理类
     */
    export class ProtobufManager {

        /**
         * 构建protobuf
         */
        static buildProto(urls: Array<string>): void;

        /**
         * 获取protobuf定义
         */
        static getProtoClass(className: string): any;

        /**
         * 获取protobuf对象
         */
        static getProtoObject(className: string, data: any): any;

        /**
         * 解析数据
         */
        static decode(className: string, buffer: ArrayBuffer): any;
    }

    export class NetConnectionCreator extends NetConnectionInterceptor {

    }

    /**
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    export class NetConnectionDecoder extends NetConnectionInterceptor {

    }

    /**
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    export class NetConnectionEncoder extends NetConnectionInterceptor {

    }

    /**
     * 心跳检测器
     */
    export class NetConnectionHeartBeat extends NetConnectionInterceptor {

    }

}
