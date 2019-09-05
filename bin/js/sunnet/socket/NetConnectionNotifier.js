var sunnet;
(function (sunnet) {
    /**
     * 网络消息派发器
     */
    var NetConnectionNotifier = /** @class */ (function () {
        function NetConnectionNotifier() {
        }
        /**
         * 通知网络消息
         */
        NetConnectionNotifier.notify = function (cmd, data) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("NetConnectionNotifier=> notify cmd:" + cmd.toString(16) + ", data:" + JSON.stringify(data));
            }
            NetConnectionNotifier.inst.dispatchEvent(cmd.toString(), data);
        };
        /**
         * 注册网络消息监听
         */
        NetConnectionNotifier.register = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("NetConnectionNotifier=>register cmd:" + cmd.toString(16));
            }
            NetConnectionNotifier.inst.addEventListener(cmd.toString(), method, caller);
        };
        /**
         * 移除网络消息监听
         */
        NetConnectionNotifier.unregister = function (cmd, method, caller) {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("NetConnectionNotifier=>unregister cmd:" + cmd.toString(16));
            }
            NetConnectionNotifier.inst.removeEventListener(cmd.toString(), method, caller);
        };
        NetConnectionNotifier.inst = new suncom.EventSystem();
        return NetConnectionNotifier;
    }());
    sunnet.NetConnectionNotifier = NetConnectionNotifier;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionNotifier.js.map