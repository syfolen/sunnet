
module sunnet {
	/**
	 * 接收数据缓存
	 */
	export interface ICacheMessage {
		/**
		 * 接收时间
		 */
		time: number;

		/**
		 * 派发延时
		 */
		delay: number;

		/**
		 * 数据对象
		 */
		data: ISocketMessage;
	}
}