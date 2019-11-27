var sunnet;
(function (sunnet) {
    /**
     * 网络模块消息定义
     * export
     */
    var NotifyKey;
    (function (NotifyKey) {
        /**
         * 网络状态变化
         * export
         */
        NotifyKey.SOCKET_STATE_CHANGE = "sunnet.NotifyKey.SOCKET_STATE_CHANGE";
        /**
         * 网络异常通知
         * export
         */
        NotifyKey.SOCKET_STATE_ANOMALY = "sunnet.NotifyKey.SOCKET_STATE_ANOMALY";
        /**
         * 网络重连通知
         * export
         */
        NotifyKey.SOCKET_RETRY_CONNECT = "sunnet.NotifyKey.SOCKET_RETRY_CONNECT";
    })(NotifyKey = sunnet.NotifyKey || (sunnet.NotifyKey = {}));
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NotifyKey.js.map