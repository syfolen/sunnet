
module sunnet {
    /**
     * 网络连接对象接口
     * export
     */
    export interface INetConnection extends suncom.IEventSystem {
        /**
         * Ping值
         * 说明：
         * 1. 这个值在NetConnectionPing中自动更新
         */
        ping: number;

        /**
         * 时间推算延迟
         */
        latency: number;

        /**
         * 服务器时间
         * 说明：
         * 1. 这个值要求在NetConnectionPing的继承类中更新
         */
        srvTime: number;

        /**
         * 客户端时间
         * 说明：
         * 1. 这个值要求在NetConnectionPing的继承类中更新
         */
        clientTime: number;

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         * export
         */
        connect(ip: string, port: number, byDog: boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为：false
         * export
         */
        close(byError?: boolean): void;

        /**
         * 发送二进制数据
         */
        send(bytes: Uint8Array): void;

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         * export
         */
        sendBytes(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): void;

        /**
         * 发送数据
         */
        flush(): void;

        /**
         * 获取当前服务器时间戳
         */
        getCurrentServerTimestamp(): number;

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
         * export
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
         * export
         */
        readonly pipeline: INetConnectionPipeline;
    }
}