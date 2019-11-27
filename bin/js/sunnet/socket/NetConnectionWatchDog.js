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
    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     * export
     */
    var NetConnectionWatchDog = /** @class */ (function (_super) {
        __extends(NetConnectionWatchDog, _super);
        function NetConnectionWatchDog(connection) {
            var _this = _super.call(this, connection) || this;
            /**
             * 重连次数
             */
            _this.$retryCount = 0;
            _this.$connection.addEventListener(sunnet.EventKey.KILL_WATCH_DOG, _this.$onKillWatchDog, _this);
            return _this;
        }
        /**
         * 销毁拦截器
         */
        NetConnectionWatchDog.prototype.destroy = function () {
            this.$connection.removeEventListener(sunnet.EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            _super.prototype.destroy.call(this);
        };
        /**
         * 当网络连接被建立时，需要移除检测狗
         */
        NetConnectionWatchDog.prototype.$onConnected = function () {
            this.$retryCount = 0;
            this.$onKillWatchDog();
        };
        /**
         * 网络连接断开回调，若因异常断开，则在1000毫秒后开始重连
         */
        NetConnectionWatchDog.prototype.$onDisconnected = function (byError) {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("NetConnectionWatchDog=> \u7F51\u7EDC\u8FDE\u63A5\u5F02\u5E38\uFF0C" + sunnet.Config.TCP_RETRY_DELAY + "\u6BEB\u79D2\u540E\u91CD\u8FDE\uFF01");
                }
                if (this.$retryCount >= sunnet.Config.TCP_MAX_RETRY_TIME) {
                    this.$retryCount = 0;
                    puremvc.Facade.getInstance().sendNotification(sunnet.NotifyKey.SOCKET_STATE_CHANGE, 2);
                    return;
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, sunnet.Config.TCP_RETRY_DELAY, this.$onDoingConnect, this);
                puremvc.Facade.getInstance().sendNotification(sunnet.NotifyKey.SOCKET_STATE_ANOMALY, this.$retryCount);
            }
        };
        /**
         * 杀死检测狗
         */
        NetConnectionWatchDog.prototype.$onKillWatchDog = function () {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        };
        /**
         * 重连
         */
        NetConnectionWatchDog.prototype.$onDoingConnect = function () {
            // 只有在网络处于未连接状态时才会进行重连
            if (this.$connection.state === sunnet.NetConnectionStateEnum.DISCONNECTED) {
                this.$retryCount++;
                puremvc.Facade.getInstance().sendNotification(sunnet.NotifyKey.SOCKET_RETRY_CONNECT, this.$retryCount);
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("检测狗不能正常工作，因为：", "state:" + suncom.Common.convertEnumToString(this.$connection.state, sunnet.NetConnectionStateEnum));
                }
            }
        };
        return NetConnectionWatchDog;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionWatchDog = NetConnectionWatchDog;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionWatchDog.js.map