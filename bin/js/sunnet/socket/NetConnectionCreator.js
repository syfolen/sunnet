var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var sunnet;
(function (sunnet) {
    var NetConnectionCreator = /** @class */ (function (_super) {
        __extends(NetConnectionCreator, _super);
        function NetConnectionCreator(connection) {
            var _this = _super.call(this, connection) || this;
            /**
             * 等待发送的消息队列
             */
            _this.$messages = [];
            _this.$connection.addEventListener(sunnet.EventKey.CLEAR_MESSAGE_QUEUE, _this.$onClearMessageQueue, _this);
            return _this;
        }
        NetConnectionCreator.prototype.destroy = function () {
            this.$connection.removeEventListener(sunnet.EventKey.CLEAR_MESSAGE_QUEUE, this.$onClearMessageQueue, this);
            _super.prototype.destroy.call(this);
        };
        /**
         * 网络连接成功回调
         */
        NetConnectionCreator.prototype.$onConnected = function () {
            while (this.$messages.length) {
                var data = this.$messages.pop();
                this.$connection.sendBytes(data.cmd, data.bytes, data.ip, data.port);
            }
        };
        /**
         * 清除所有网络消息缓存
         */
        NetConnectionCreator.prototype.$onClearMessageQueue = function () {
            this.$messages.length = 0;
        };
        /**
         * 是否需要重连
         */
        NetConnectionCreator.prototype.$needCreate = function (ip, port) {
            // 若网络未连接，则需要重连
            if (this.$connection.state === sunnet.NetConnectionStateEnum.DISCONNECTED) {
                return true;
            }
            // 若网络己连接
            if (this.$connection.state === sunnet.NetConnectionStateEnum.CONNECTED) {
                // 若IP和PORT有效且与请求的数据不一致，则需要重连
                if (ip !== void 0 && port !== void 0 && this.$connection.ip !== ip && this.$connection.port !== port) {
                    return true;
                }
            }
            // 否则不需要重连
            return false;
        };
        /**
         * 数据发送拦截接口
         */
        NetConnectionCreator.prototype.send = function (cmd, bytes, ip, port) {
            if (this.$needCreate(ip, port) == false) {
                return [cmd, bytes, ip, port];
            }
            this.$connection.connect(ip, port, false);
            var data = {
                cmd: cmd,
                bytes: bytes,
                ip: ip,
                port: port
            };
            this.$messages.push(data);
            return null;
        };
        return NetConnectionCreator;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionCreator = NetConnectionCreator;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionCreator.js.map