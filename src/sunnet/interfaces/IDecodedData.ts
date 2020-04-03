
module sunnet {
	/**
	 * 己成功解析的数据信息
	 */
	export interface IDecodedData {
		/**
		 * 消息对象
		 */
		msg: ISocketMessage;

		/**
		 * 解析时间
		 */
		time: number;

		/**
		 * 指定延时时间
		 */
		delay: number;
	}
}