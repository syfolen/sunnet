
module sunnet {
    /**
     * 网络模块消息定义
     * export
     */
    export namespace NotifyKey {
        /**
         * 网络状态变化通知
         * export
         */
        export const SOCKET_STATE_CHANGE: string = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";

        /**
         * 网络重连通知
         * export
         */
        export const SOCKET_RETRY_CONNECT: string = "sunnet.NotifyKey.SOCKET_RETRY_CONNECT";
    }
}