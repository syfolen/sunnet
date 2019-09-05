var _this = this;
setTimeout(function () {
    //程序入口
    Laya.init(600, 400, Laya.WebGL);
    puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
    puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);
    sunnet.ProtobufManager.buildProto(["other/test.proto"]);
    suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(suncom.Handler.create(_this, function () {
        var ETest = sunnet.ProtobufManager.getProtoClass("msg.ProtoTest.ETest");
        var bytes = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest2", {
            uid: 123,
            str: "abc"
        });
        var bytes2 = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest", {
            n32: 123456,
            sn32: -6,
            sn64: -12345678975554534564,
            str: "abc"
        });
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionCreator);
        PSAppUtils.getInstance().pipeline.add("recv", sunnet.NetConnectionDecoder);
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionEncoder);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionHeartBeat);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionWatchDog);
        PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.190", 3653);
        // PSAppUtils.getInstance().sendBytes(1, bytes, "127.0.0.1", 8999);
    })));
}, 1000);
//# sourceMappingURL=Main.js.map