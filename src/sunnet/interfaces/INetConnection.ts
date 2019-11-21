
module sunnet {

    /**
     * 网络连接对象接口
     * export
     */
    export interface INetConnection extends suncom.IEventSystem {

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         * export
         */
        connect(ip: string, port: number, byDog: boolean): void;

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         * export
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
         * export
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