
module sunnet {

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
}