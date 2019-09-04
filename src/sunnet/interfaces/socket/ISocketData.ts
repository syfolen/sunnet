
module sunnet {

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
}