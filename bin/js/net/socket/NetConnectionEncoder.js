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
     * WebSocket 数据编码器，负责打包发送前的数据
     */
    var NetConnectionEncoder = /** @class */ (function (_super) {
        __extends(NetConnectionEncoder, _super);
        function NetConnectionEncoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 拦截数据
         */
        NetConnectionEncoder.prototype.send = function (cmd, bytes, ip, port) {
            var input = this.$connection.input;
            // 写入包头
            input.writeUint16(cmd);
            input.writeUint16(0);
            // 写入包体
            bytes !== null && input.writeArrayBuffer(bytes);
            if (cmd == sunnet.HeartbeatCommandEnum.REQUEST) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString(16) + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
                }
            }
            else if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log("\u53D1\u9001\u6570\u636E cmd:" + cmd.toString(16) + ", bytes:" + (bytes === null ? 0 : bytes.byteLength));
            }
            return null;
        };
        return NetConnectionEncoder;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionEncoder = NetConnectionEncoder;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionEncoder.js.map