
module sunnet {
	/**
	 * 网络延时计算脚本
	 * export
	 */
	export abstract class NetConnectionPing extends NetConnectionInterceptor {
		/**
		 * 追踪器列表
		 */
		private $trackers: IProtocalTracker[] = [];

        /**
         * 网络连接成功
         * export
         */
		protected $onConnected(): void {
			this.$trackers.length = 0;
		}

		/**
		 * 数据发送拦截接口
         * export
		 */
		send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any> {
			// 若发送的协议为可靠协议，则创建追踪器
			if (this.$isReliableProtocal(cmd) === true) {
				const tracker: IProtocalTracker = {
					rsp: cmd,
					rep: this.$getProtocalReplyCommand(cmd),
					time: new Date().valueOf()
				};
				this.$trackers.push(tracker);
			}
			return [cmd, bytes, ip, port];
		}

		/**
		 * 数据接收拦截接口
         * export
		 */
		recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any> {
			// 必须是可靠协议，才需要进行追踪反馈
			if (this.$trackers.length > 0) {
				const tracker: IProtocalTracker = this.$trackers[0];
				if (tracker.rep === cmd) {
					this.$trackers.shift();
					this.$connection.ping = new Date().valueOf() - tracker.time;
					this.$dealRecvData(cmd, data);
				}
			}
			return [cmd, srvId, bytes, data];
		}

		/**
		 * 判断是否为可靠协议
		 * 说明：
		 * 1. 仅允许由客户端发起，且服务端必定会回复的协议视为可靠协议
		 * 2. 若发送的协议为可靠协议，则会自动为其创建一个追踪器
		 * export
		 */
		protected abstract $isReliableProtocal(cmd: number): boolean;

		/**
		 * 获取命令的应答协议号
		 * export
		 */
		protected abstract $getProtocalReplyCommand(cmd: number): number;

		/**
		 * 处理接收到的数据
		 * export
		 */
		protected abstract $dealRecvData(cmd: number, data: any): void;

		/**
		 * 更新服务器时间
		 * 说明：
		 * 1. 需要由继承类在$dealRecvData中调用来更新服务器时间相关的数据
		 * export
		 */
		protected $updateServerTimestamp(time: number, flag: ServerTimeUpdateFlagEnum): void {
			const latency: number = Math.ceil(this.$connection.ping / 2);
			if (flag === ServerTimeUpdateFlagEnum.RESET || latency < this.$connection.latency) {
				// 更新服务端时间
				this.$connection.srvTime = time;
				// 更新时间推算延迟
				this.$connection.latency = latency;
				// 更新客户端时间
				this.$connection.clientTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
			}
			if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
				const srvTime: number = this.$connection.srvTime + suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM) - this.$connection.clientTime;
				suncom.Logger.log(suncom.DebugMode.ANY, `服务器时间：${suncom.Common.formatDate("yy-MM-dd hh:mm:ss MS", srvTime)}，Ping：${this.$connection.ping}，时间推算延延：${this.$connection.latency}`);
			}
		}
	}
}