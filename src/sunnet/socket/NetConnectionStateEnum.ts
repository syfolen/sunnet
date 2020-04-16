
module sunnet {
    /**
     * 网络状态枚举
     * export
     */
    export enum NetConnectionStateEnum {
        /**
         * 己连接
         * export
         */
        CONNECTED = 0,

        /**
         * 正在连接
         * export
         */
        CONNECTING,

        /**
         * 己断开
         * export
         */
        DISCONNECTED
    }
}