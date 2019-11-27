
module sunnet {
    /**
     * 套接字数据在消息管道中传递时的数据结构
     */
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
}