var sunnet;
(function (sunnet) {
    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     */
    var NetConnectionInterceptor = /** @class */ (function () {
        function NetConnectionInterceptor(connection) {
            this.$connection = connection;
            this.$connection.addEventListener(sunnet.EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.addEventListener(sunnet.EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
        }
        /**
         * 销毁拦截器
         */
        NetConnectionInterceptor.prototype.destroy = function () {
            this.$connection.removeEventListener(sunnet.EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(sunnet.EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        };
        /**
         * 网络连接成功
         */
        NetConnectionInterceptor.prototype.$onConnected = function () {
        };
        /**
         * 网络连接断开
         */
        NetConnectionInterceptor.prototype.$onDisconnected = function (byError) {
        };
        /**
         * 数据发送拦截接口
         */
        NetConnectionInterceptor.prototype.send = function (cmd, bytes, ip, port) {
            return [cmd, bytes, ip, port];
        };
        /**
         * 数据接收拦截接口
         */
        NetConnectionInterceptor.prototype.recv = function (cmd, srvId, bytes, data) {
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionInterceptor;
    }());
    sunnet.NetConnectionInterceptor = NetConnectionInterceptor;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionInterceptor.js.map