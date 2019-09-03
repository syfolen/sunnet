var sunnet;
(function (sunnet) {
    var PSAppUtils = /** @class */ (function () {
        function PSAppUtils() {
        }
        PSAppUtils.getInstance = function () {
            if (PSAppUtils.inst == null) {
                PSAppUtils.inst = new PSAppUtils();
            }
            return PSAppUtils.inst;
        };
        /**
         * @byError: 是否因网络错误原因被关闭，默认为false
         */
        PSAppUtils.prototype.close = function (byError) {
        };
        /**
         * 是否开启调试模式
         */
        PSAppUtils.DEBUG = true;
        PSAppUtils.inst = null;
        return PSAppUtils;
    }());
    sunnet.PSAppUtils = PSAppUtils;
})(sunnet || (sunnet = {}));
//# sourceMappingURL=PSAppUtils.js.map