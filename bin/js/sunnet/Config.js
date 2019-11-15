var sunnet;
(function (sunnet) {
    var Config = /** @class */ (function () {
        function Config() {
        }
        /**
         * 重连延时
         */
        Config.TCP_RETRY_DELAY = 20 * 1000;
        /**
         * 最大重连次数
         */
        Config.TCP_RETRY_MAX_COUNT = 10;
        return Config;
    }());
    sunnet.Config = Config;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=Config.js.map