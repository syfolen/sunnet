
module sunnet {

    export abstract class EventKey {
        // 网络己连接
        static readonly SOCKET_CONNECTED: string = "sunnet.EventKey.SOCKET_CONNECTED";
        // 网络己断开
        static readonly SOCKET_DISCONNECTED: string = "sunnet.EventKey.SOCKET_DISCONNECTED";

        // 杀死检测狗
        static readonly KILL_WATCH_DOG: string = "sunnet.EventKey.KILL_WATCH_DOG";
        // 清空未发送的网络消息队列
        static readonly CLEAR_MESSAGE_QUEUE: string = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
    }
}