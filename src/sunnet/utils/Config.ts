
module sunnet {
	/**
	 * export
	 */
	export namespace Config {
		/**
		 * 服务端地址
		 * export
		 */
		export let TCP_IP: string;

		/**
		 * 服务端端口
		 * export
		 */
		export let TCP_PORT: number;

		/**
		 * 重连延时
		 * export
		 */
		export let TCP_RETRY_DELAY: number = 20 * 1000;

		/**
		 * 最大重连次数
		 * export
		 */
		export let TCP_MAX_RETRIES: number = 10;

		/**
		 * 心跳发送指令
		 * export
		 */
		export let HEARTBEAT_REQUEST_COMMAND: number = -1;

		/**
		 * 心跳接收指令
		 * export
		 */
		export let HEARTBEAT_RESPONSE_COMMAND: number = -1;

		/**
		 * 心跳超时时间
		 * export
		 */
		export let HEARTBEAT_TIMEOUT_MILLISECONDS: number = 3000;

		/**
		 * 心跳间隔时间
		 * export
		 */
		export let HEARTBEAT_INTERVAL_MILLISECONDS: number = 5000;

		/**
		 * 以固定频率发送心跳，默认为：false
		 * 说明：
		 * 1. 若为true，则心跳的发送频率不受业务数据发送的影响
		 * 2. 若为false，则有业务数据持续发送时，就不会发送心跳
		 * export
		 */
		export let HEARTBEAT_FIXED_FREQUENCY: boolean = false;
	}

}