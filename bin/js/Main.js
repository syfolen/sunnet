// const ip = "192.168.0.190";
// const port = 3653;
var ip = "127.0.0.1";
var port = 8999;
var Main = /** @class */ (function () {
    function Main() {
        //程序入口
        Laya.init(600, 400, Laya.WebGL);
        Laya.loader.load([
            "other/fishing.proto",
            "other/protocal.json"
        ], Laya.Handler.create(this, this.$onLoadProto));
    }
    Main.prototype.$onLoadProto = function () {
        puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
        puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);
        suncore.System.timeStamp.resume();
        sunnet.ProtobufManager.getInstance().buildProto("other/fishing.proto");
        sunnet.ProtobufManager.getInstance().buildProtocal("other/protocal.json");
        PSAppUtils.getInstance().pipeline.add("recv", sunnet.NetConnectionDecoder);
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionEncoder);
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionCreator);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionHeartBeat);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionWatchDog);
        PSAppUtils.getInstance().pipeline.add("recv", ProtobufDecoder);
        login("12345", "12345");
    };
    return Main;
}());
function sendMsg(cmd, msg) {
}
function login(acount, nickname, password) {
    var date = new Date();
    var gmtHours = -date.getTimezoneOffset() / 60;
    var timezone = "UTC " + (gmtHours < 0 ? gmtHours : "+" + gmtHours);
    var data = {
        Acount: acount,
        Nick: nickname,
        Timezone: timezone
    };
    var bytes = sunnet.ProtobufManager.getInstance().encode("msg.LoginTest", data);
    PSAppUtils.getInstance().sendBytes(1, bytes, ip, port);
}
setTimeout(function () {
    new Main();
}, 1000);
//# sourceMappingURL=Main.js.map