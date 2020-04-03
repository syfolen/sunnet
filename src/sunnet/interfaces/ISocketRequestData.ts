
module sunnet {
    /**
     * WebSocket数据请求对象
     */
    export interface ISocketRequestData {
        /**
         * 协议号
         * export
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

        /**
         * 心跳是否关心此数据
         */
        care: boolean;
    }
}