
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
		export let TCP_MAX_RETRY_TIME: number = 10;

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
	}

}