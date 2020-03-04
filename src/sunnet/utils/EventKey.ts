
module sunnet {
    /**
     * 网络事件定义
     */
    export namespace EventKey {
        // 网络己连接
        export const SOCKET_CONNECTED: string = "sunnet.EventKey.SOCKET_CONNECTED";
        // 网络己断开
        export const SOCKET_DISCONNECTED: string = "sunnet.EventKey.SOCKET_DISCONNECTED";

        // 杀死检测狗
        export const KILL_WATCH_DOG: string = "sunnet.EventKey.KILL_WATCH_DOG";
        // 清空未发送的网络消息队列
        export const CLEAR_MESSAGE_QUEUE: string = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
    }
}