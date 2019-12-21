

const ip = "192.168.0.168";
const port = 3653;

// const ip = "127.0.0.1";
// const port = 8999;

class Main {

	constructor() {
		//程序入口
		Laya.init(600, 400, Laya.WebGL);

		Laya.loader.load([
			"other/fishing.proto",
			"other/protocal.json"
		], Laya.Handler.create(this, this.$onLoadProto));
	}

	private $onLoadProto(): void {
		puremvc.Facade.getInstance().registerCommand(suncore.NotifyKey.START_TIMELINE, suncore.StartTimelineCommand);
		puremvc.Facade.getInstance().sendNotification(suncore.NotifyKey.START_TIMELINE, suncore.ModuleEnum.SYSTEM);

		sunnet.ProtobufManager.getInstance().buildProto("other/fishing.proto");
		sunnet.ProtobufManager.getInstance().buildProtocal("other/protocal.json");

		sunnet.Config.HEARTBEAT_REQUEST_COMMAND = 103;
		sunnet.Config.HEARTBEAT_RESPONSE_COMMAND = 103;

		suncom.Global.debugMode = suncom.DebugMode.NETWORK;

		PSAppUtils.getInstance().pipeline.add("recv", sunnet.NetConnectionDecoder);
		PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionEncoder);
		PSAppUtils.getInstance().pipeline.add("send", sunnet.NetConnectionCreator);
		PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionHeartBeat);
		PSAppUtils.getInstance().pipeline.add(sunnet.NetConnectionWatchDog);
		PSAppUtils.getInstance().pipeline.add("recv", ProtobufDecoder);

		login("12345", "12345");
	}
}

function sendMsg(cmd: number, msg: any): void {

}

function login(acount: string, nickname: string, password?: string): void {
	const date = new Date();
	const gmtHours = -date.getTimezoneOffset() / 60;

	const timezone = "UTC " + (gmtHours < 0 ? gmtHours : "+" + gmtHours);

	const data = {
		Acount: acount,
		Nick: nickname,
		Timezone: timezone
	}
	const bytes = sunnet.ProtobufManager.getInstance().encode("msg.LoginTest", data);
	PSAppUtils.getInstance().sendBytes(1, bytes, ip, port);
}

setTimeout(() => {
	new Main();
}, 1000);
