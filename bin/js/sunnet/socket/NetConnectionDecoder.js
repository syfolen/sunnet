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
     * WebSocket Protobuf数据 解码器
     * 解码器可存在多个，任意一个解码成功，则会自动跳过其它解码器
     */
    var NetConnectionDecoder = /** @class */ (function (_super) {
        __extends(NetConnectionDecoder, _super);
        function NetConnectionDecoder() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * 数据接收拦截接口
         */
        NetConnectionDecoder.prototype.recv = function (cmd, srvId, buffer, data) {
            var input = this.$connection.input;
            cmd = input.getUint16();
            srvId = input.getUint16();
            buffer = input.buffer.slice(input.pos);
            if (cmd === sunnet.HeartbeatCommandEnum.RESPONSE) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log("响应心跳");
                }
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("NetConnection=> 响应消息 cmd:" + cmd + ", srvId:" + srvId + ", length:" + input.bytesAvailable);
                }
            }
            // 清除缓冲区中的数据
            input.clear();
            return [cmd, srvId, buffer, data];
        };
        return NetConnectionDecoder;
    }(sunnet.NetConnectionInterceptor));
    sunnet.NetConnectionDecoder = NetConnectionDecoder;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionDecoder.js.map