
module sunnet {

	export abstract class Config {

		/**
		 * 服务端地址
		 */
		static TCP_IP: string;

		/**
		 * 服务端端口
		 */
		static TCP_PORT: number;

		/**
		 * 重连延时
		 */
		static TCP_RETRY_DELAY: number = 20 * 1000;

		/**
		 * 最大重连次数
		 */
		static TCP_MAX_RETRY_TIME: number = 10;
	}

}