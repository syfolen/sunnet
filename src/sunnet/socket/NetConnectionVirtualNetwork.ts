
module sunnet {
	/**
	 * 虚拟网络环境，用于模拟现实中的网络延迟，掉线等
	 * export
	 */
	export class NetConnectionVirtualNetwork extends NetConnectionInterceptor {
		/**
		 * 己解析的网络数据缓存队列
		 */
		private $datas: IDecodedData[] = [];

		/**
		 * 当前时间（秒）
		 * 说明：
		 * 1. 主要用于网络波动的概率计算（当前秒发生递增时计算）
		 */
		private $currentSeconds: number = 0;

		/**
		 * 网络是否处于波动状态
		 */
		private $isNetworkWaving: boolean = false;

		/**
		 * 网络建立连接的时间
		 */
		private $lastConnectedTimestamp: number = 0;

		/**
		 * 网络稳定时间
		 */
		private $currentConnectionReliableTime: number = 0;

        /**
         * 网络连接成功
         */
		protected $onConnected(): void {
			this.$lastConnectedTimestamp = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
			this.$currentConnectionReliableTime = this.$getReliableTimeOfConnection() * 1000;
			this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
			this.$connection.addEventListener(EventKey.SOCKET_MESSAGE_DECODED, this.$onSocketMessageDecoded, this);
		}

        /**
         * 网络连接断开
         */
		protected $onDisconnected(byError: boolean): void {
			this.$datas.length = 0;
			this.$currentSeconds = 0;
			this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
			this.$connection.removeEventListener(EventKey.SOCKET_MESSAGE_DECODED, this.$onSocketMessageDecoded, this);
		}

		/**
		 * 每帧派发网络数据
		 */
		private $onEnterFrame(): void {
			const time: number = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);

			// 网络连接超出稳定时间
			if (this.$lastConnectedTimestamp > 0 && time > this.$lastConnectedTimestamp + this.$currentConnectionReliableTime) {
				this.$connection.dispatchEvent(EventKey.CLOSE_CONNECT_BY_VIRTUAL);
				return;
			}

			// 当前秒
			const seconds: number = Math.floor(time / 1000);
			// 每秒均可能发生网络波动
			if (this.$currentSeconds !== seconds) {
				this.$currentSeconds = seconds;
				this.$isNetworkWaving = suncom.Common.random(0, 100) < this.$getProbabilyOfNetworkWave();
			}

			// 存在缓存数据
			if (this.$datas.length > 0) {
				const data: IDecodedData = this.$datas[0];
				// 己延时处理
				if (time > data.time + data.delay) {
					if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
						if (data.msg.id === Config.HEARTBEAT_RESPONSE_COMMAND) {
							if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
								suncom.Logger.log(`心跳解析成功 ==> cmd:${data.msg.id}, data:${JSON.stringify(data.msg.data)}`);
							}
						}
						else {
							suncom.Logger.log(`消息解析成功 ==> cmd:${data.msg.id}, data:${JSON.stringify(data.msg.data)}`);
						}
					}
					suncore.MsgQ.send(suncore.MsgQModEnum.NSL, MsgQIdEnum.NSL_RECV_DATA, this.$datas.shift().msg);
				}
			}
		}

		/**
		 * 缓存解析成功的网络消息
		 */
		private $onSocketMessageDecoded(msg: ISocketMessage): void {
			const data: IDecodedData = {
				msg: msg,
				time: suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM),
				delay: this.$calculateMessageDelayTime()
			}
			this.$datas.push(data);
		}

		/**
		 * 网络连接的可靠时间
		 * 说明：
		 * 1. 每次网络成功连接，经多少秒后强制断开
		 * export
		 */
		protected $getReliableTimeOfConnection(): number {
			if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
				return suncom.Common.random(180, 300);
			}
			else {
				return 1440 * 30;
			}
		}

		/**
		 * 网络延时波动概率（0-100）
		 * 说明：
		 * 1. 当网络发生波动时，延时会较大
		 * export
		 */
		protected $getProbabilyOfNetworkWave(): number {
			if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.BAD) {
				return 10;
			}
			else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
				return 25;
			}
			else {
				return 0;
			}
		}

		/**
		 * 数据包的延时时间
		 * 说明：
		 * 1. 每新收到一个数据包，计算它应当被延时的时间
		 * export
		 */
		protected $calculateMessageDelayTime(): number {
			if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.GOOD) {
				return suncom.Common.random(60, 150);
			}
			else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.BAD) {
				if (this.$isNetworkWaving === false) {
					return suncom.Common.random(200, 800);
				}
				else {
					return suncom.Common.random(1000, 2000);
				}
			}
			else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.UNSTABLE) {
				if (this.$isNetworkWaving === false) {
					return suncom.Common.random(1000, 2500);
				}
				else {
					return suncom.Common.random(3000, 8000);
				}
			}
			// 一帧一个数据包
			else {
				return 0;
			}
		}
	}
}