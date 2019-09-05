var sunnet;
(function (sunnet) {
    var EventKey = /** @class */ (function () {
        function EventKey() {
        }
        // 网络己连接
        EventKey.SOCKET_CONNECTED = "sunnet.EventKey.SOCKET_CONNECTED";
        // 网络己断开
        EventKey.SOCKET_DISCONNECTED = "sunnet.EventKey.SOCKET_DISCONNECTED";
        // 杀死检测狗
        EventKey.KILL_WATCH_DOG = "sunnet.EventKey.KILL_WATCH_DOG";
        // 清空未发送的网络消息队列
        EventKey.CLEAR_MESSAGE_QUEUE = "sunnet.EventKey.CLEAR_MESSAGE_QUEUE";
        return EventKey;
    }());
    sunnet.EventKey = EventKey;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=EventKey.js.map