
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
         * 是否缓存发送的数据流 { yes: boolean }
         */
        export const CACHE_SEND_BYTES: string = "sunnet.EventKey.CACHE_SEND_BYTES";

        /**
         * 发送所有己缓存的数据流
         */
        export const FLUSH_CACHED_BYTES: string = "sunnet.EventKey.FLUSH_CACHED_BYTES";

        /**
         * 清空当前所有未请求的数据
         */
        export const CLEAR_REQUEST_DATA: string = "sunnet.EventKey.CLEAR_REQUEST_DATA";

        /**
         * 网络消息解析成功 { msg: ISocketMessage }
         */
        export const SOCKET_MESSAGE_DECODED: string = "sunnet.EventKey.SOCKET_MESSAGE_DECODED";

        /**
         * 模拟断开网络
         */
        export const CLOSE_CONNECT_BY_VIRTUAL: string = "sunnet.EventKey.CLOSE_CONNECT_BY_VIRTUAL";
    }
}