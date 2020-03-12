
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
         * 网络连接失败（检测狗在尝试重连失败后会派发此消息）
         * export
         */
        export const SOCKET_CONNECT_FAILED: string = "sunnet.NotifyKey.SOCKET_CONNECT_FAILED";
    }
}