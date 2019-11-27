var sunnet;
(function (sunnet) {
    /**
     * export
     */
    var Config;
    (function (Config) {
        /**
         * 重连延时
         * export
         */
        Config.TCP_RETRY_DELAY = 20 * 1000;
        /**
         * 最大重连次数
         * export
         */
        Config.TCP_MAX_RETRY_TIME = 10;
        /**
         * 心跳发送指令
         */
        Config.HEARTBEAT_REQUEST_COMMAND = -1;
        /**
         * 心跳接收指令
         */
        Config.HEARTBEAT_RESPONSE_COMMAND = -1;
    })(Config = sunnet.Config || (sunnet.Config = {}));
})(sunnet || (sunnet = {}));
//# sourceMappingURL=Config.js.map