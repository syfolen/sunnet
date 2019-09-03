var PSAppUtils = /** @class */ (function () {
    function PSAppUtils() {
    }
    PSAppUtils.getInstance = function () {
        return PSAppUtils.inst;
    };
    PSAppUtils.inst = new sunnet.NetConnection("default");
    return PSAppUtils;
}());
//# sourceMappingURL=PSAppUtils.js.map