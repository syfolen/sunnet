
module sunnet {
    /**
     * 网络事件定义
     */
    export namespace EventKey {
        /**
         * 网络己连接 { none }
         */
        export const SOCKET_CONNECTED: string = "sunnet.EventKey.SOCKET_CONNECTED";

        /**
         * 网络己断开 { none }
         */
        export const SOCKET_DISCONNECTED: string = "sunnet.EventKey.SOCKET_DISCONNECTED";

        /**
         * 网络正在连接 { none }
         */
        export const SOCKET_CONNECTING: string = "sunnet.EventKey.SOCKET_CONNECTING";

        /**
         * 网络连接失败 { none }
         */
        export const SOCKET_CONNECT_FAILED: string = "sunnet.EventKey.SOCKET_CONNECT_FAILED";

        /**
         * 杀死检测狗
         */
        export const KILL_WATCH_DOG: string = "sunnet.EventKey.KILL_WATCH_DOG";

        /**
         * 缓存网络数据 { msg: ISocketMessage }
         */
        export const CACHE_MESSAGE_DATA: string = "sunnet.EventKey.CACHE_MESSAGE_DATA";

        /**
         * 清空未发送的网络消息队列
         */
        export const CLEAR_MESSAGE_QUEUE: string = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";

        /**
         * 模拟断开网络
         */
        export const CLOSE_CONNECT_BY_VIRTUAL: string = "sunnet.EventKey.CLOSE_CONNECT_BY_VIRTUAL";
    }
}