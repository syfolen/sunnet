
module sunnet {
    /**
     * 网络消息结构
     * export
     */
    export interface ISocketMessage {
        /**
         * 消息ID
         * export
         */
        id?: number;

        /**
         * 消息名字
         * export
         */
        name: string;

        /**
         * 挂载的数据对象
         * export
         */
        data?: any;

        /**
         * 服务器地址
         * export
         */
        ip?: string;

        /**
         * 服务器端口
         * export
         */
        port?: number;
    }
}