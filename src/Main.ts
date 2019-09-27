

enum ProtocalEnum {
	LOGIN_REQ = 1,
	LOGIN_RSP = 2
}

setTimeout(() => {
	//程序入口
	Laya.init(600, 400, Laya.WebGL);

	puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.CREATE_TIMELINE, suncore.CreateTimelineCommand);
	puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.CREATE_TIMELINE);

	suncore.System.timeStamp.resume();

	sunnet.ProtobufManager.buildProto(["other/fishing.proto"]);

	suncore.MessageNotifier.register(2, (data) => {
		console.log(JSON.stringify(data));
	}, null);

	suncore.System.addTask(suncore.ModuleEnum.SYSTEM, new suncore.SimpleTask(
		suncom.Handler.create(this, () => {

			// const ETest = sunnet.ProtobufManager.getProtoClass("msg.ProtoTest.ETest");
			// const bytes = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest2", {
			// 	uid: 555,
			// 	str: "555"
			// });
			// const bytes1 = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest2", {
			// 	uid: 4294967295,
			// 	str: "proto test2"
			// });

			// const bytes2 = sunnet.ProtobufManager.getProtoObject("msg.ProtoTest", {
			// 	n32: 123456,
			// 	sn32: -6,
			// 	sn64: dcodeIO.Long.fromString("-9223372036854775807", false),
			// 	str: "abc"
			// });

			// console.log(dcodeIO.Long.fromString("9223372036854775807", true));
			// console.log(dcodeIO.Long.fromString("9223372036854775807", true).toString());

			// const message2 = sunnet.ProtobufManager.decode("msg.ProtoTest", bytes2);
			// console.log(message2.sn64);
			// console.log(message2.sn64.toString());

			// const message = sunnet.ProtobufManager.decode("msg.ProtoTest", bytes2);

			PSAppUtils.getInstance().pipeline.add("recv", sunnet.NetConnectionDecoder);
			PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionEncoder);
			PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionCreator);
			PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionHeartBeat);
			PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionWatchDog);
			PSAppUtils.getInstance().pipeline.add("recv", ProtobufDecoder);

			// 局域网服务器
			// PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.168", 3653);
			// PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.168", 3653);

			// 志韩主机
			// PSAppUtils.getInstance().sendBytes(1, bytes2, "192.168.0.190", 3653);

			// PSAppUtils.getInstance().sendBytes(1, bytes, "127.0.0.1", 8999);

			suncore.MessageNotifier.register(ProtocalEnum.LOGIN_RSP, onLoginRsp, this);
		})
	));
}, 1000);

function onLoginRsp(data: any): void {
	console.log(JSON.stringify(data));
}

function sendMsg(cmd: number, msg: any): void {

}

// const ip = "192.168.0.190";
// const port = 3653;

const ip = "127.0.0.1";
const port = 8999;

function login(acount: string, nickname: string, password: string): void {
	const date = new Date();
	const gmtHours = -date.getTimezoneOffset() / 60;

	const timezone = "UTC " + (gmtHours < 0 ? gmtHours : "+" + gmtHours);
	console.log(timezone);

	const data = {
		Acount: acount,
		Nick: nickname,
		Timezone: timezone
	}
	const bytes = sunnet.ProtobufManager.getProtoObject("msg.LoginTest", data);
	PSAppUtils.getInstance().sendBytes(ProtocalEnum.LOGIN_REQ, bytes, ip, port);
	suncore.System.addSocketMessage(ProtocalEnum.LOGIN_RSP, { yes: true });
}

// login("abc", "yes", "123");

function logout(): void {

}
