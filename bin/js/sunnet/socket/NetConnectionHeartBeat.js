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
     * 心跳检测器
     */
    var NetConnectionHeartBeat = /** @class */ (function (_super) {
        __extends(NetConnectionHeartBeat, _super);
        function NetConnectionHeartBeat() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 当网络成功连接时，开始心跳
         */
        NetConnectionHeartBeat.prototype.$onConnected = function () {
            this.$lastRecvTime = this.$lastSendTime = new Date().valueOf();
            puremvc.Facade.getInstance().registerObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        /**
         * 连接断开后不再发送心跳
         */
        NetConnectionHeartBeat.prototype.$onDisconnected = function () {
            puremvc.Facade.getInstance().removeObserver(suncore.NotifyKey.FRAME_ENTER, this.$onFrameEnter, this);
        };
        /**
         * 心跳验证
         */
        NetConnectionHeartBeat.prototype.$onFrameEnter = function () {
            var timestamp = suncore.System.engine.getTime();
            // 心跳未回复
            if (this.$lastRecvTime < this.$lastSendTime) {
                // 若时间己超过6秒，则视为网络掉线
                if (timestamp - this.$lastSendTime > 6000) {
                    // 更新最新接收消息的时间，防止任务连续被派发
                    this.$lastRecvTime = this.$lastSendTime;
                    // 强行关闭网络连接
                    this.$connection.close(true);
                }
            }
            // 若心跳己回复，则5秒后再次发送心跳
            else if (timestamp - this.$lastSendTime > 5000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                // 记录心跳被发送的时间
                this.$lastSendTime = timestamp;
                // 发送心跳
                this.$connection.sendPB(sunnet.HeartbeatCommandEnum.REQUEST);
            }
        };
        /**
         * 数据接收拦截接口
         */
        NetConnectionHeartBeat.prototype.recv = function (cmd, srvId, bytes, data) {
            if (cmd === sunnet.HeartbeatCommandEnum.RESPONSE) {
                // 记录心跳响应的时间
                this.$lastRecvTime = suncore.System.engine.getTime();
            }
            return [cmd, srvId, bytes, data];
        };
        return NetConnectionHeartBeat;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionHeartBeat = NetConnectionHeartBeat;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionHeartBeat.js.map