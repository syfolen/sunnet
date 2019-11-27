var sunnet;
(function (sunnet) {
    /**
     * 网络状态枚举
     * export
     */
    var NetConnectionStateEnum;
    (function (NetConnectionStateEnum) {
        /**
         * 己连接
         */
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTED"] = 0] = "CONNECTED";
        /**
         * 正在连接
         */
        NetConnectionStateEnum[NetConnectionStateEnum["CONNECTING"] = 1] = "CONNECTING";
        /**
         * 己断开
         */
        NetConnectionStateEnum[NetConnectionStateEnum["DISCONNECTED"] = 2] = "DISCONNECTED";
    })(NetConnectionStateEnum = sunnet.NetConnectionStateEnum || (sunnet.NetConnectionStateEnum = {}));
})(sunnet || (sunnet = {}));
//# sourceMappingURL=NetConnectionStateEnum.js.map