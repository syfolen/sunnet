var _this = this;
setTimeout(function () {
    //程序入口
    Laya.init(600, 400, Laya.WebGL);
    puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
    puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);
    sunnet.ProtobufManager.buildProto(["other/test.proto"]);
    sunnet.NetConnectionNotifier.register(2, function (data) {
        console.log(JSON.stringify(data));
    }, null);
    suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(suncom.Handler.create(_this, function () {
        var ETest = sunnet.ProtobufManager.getProtoClass("msg.ProtoTest.ETest");
        var bytes = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest2", {
            uid: 555,
            str: "555"
        });
        var bytes1 = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest2", {
            uid: 4294967295,
            str: "proto test2"
        });
        var bytes2 = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest", {
            n32: 123456,
            sn32: -6,
            sn64: dcodeIO.Long.fromString("-9223372036854775807", false),
            str: "abc"
        });
        console.log(dcodeIO.Long.fromString("9223372036854775807", true));
        console.log(dcodeIO.Long.fromString("9223372036854775807", true).toString());
        var message2 = sunnet.ProtobufManager.decode("msg.ProtoTest", bytes2);
        console.log(message2.sn64);
        console.log(message2.sn64.toString());
        var message = sunnet.ProtobufManager.decode("msg.ProtoTest", bytes2);
        PSAppUtils.getInstance().pipeline.add("recv", sunnet.NetConnectionDecoder);
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionEncoder);
        PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionCreator);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionHeartBeat);
        PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionWatchDog);
        PSAppUtils.getInstance().pipeline.add("recv", ProtobufDecoder);
        PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.168", 3653);
        PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.168", 3653);
        // PSAppUtils.getInstance().sendBytes(1, bytes, "127.0.0.1", 8999);
    })));
}, 1000);
//# sourceMappingURL=Main.js.map