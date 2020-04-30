
module sunnet {
    /**
     * 微服务器WebSocket状态枚举
     * export
     */
    export enum MSWSStateEnum {
        /**
         * 正在连接
         * export
         */
        CONNECTING,

        /**
         * 己连接
         * export
         */
        CONNECTED,

        /**
         * 服务器关闭连接
         * export
         */
        CLOSE,

        /**
         * 网络异常断开
         * export
         */
        ERROR
    }
}