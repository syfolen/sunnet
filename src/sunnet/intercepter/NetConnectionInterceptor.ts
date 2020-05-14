
module sunnet {
    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     * export
     */
    export abstract class NetConnectionInterceptor extends puremvc.Notifier implements INetConnectionInterceptor {
        /**
         * 网络连接对象
         */
        protected $connection: INetConnection = null;

        /**
         * export
         */
        constructor(connection: INetConnection) {
            super(suncore.MsgQModEnum.NSL);
            this.$connection = connection;
            this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this, false, suncom.EventPriorityEnum.FWL);
            this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this, false, suncom.EventPriorityEnum.FWL);
        }

        /**
         * 销毁拦截器
         * export
         */
        destroy(): void {
            if (this.$destroyed === true) {
                return;
            }
            super.destroy();

            this.$connection.removeEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        }

        /**
         * 网络连接成功
         * export
         */
        protected $onConnected(): void {

        }

        /**
         * 网络连接断开
         * export
         */
        protected $onDisconnected(byError: boolean): void {

        }

		/**
		 * 数据发送拦截接口
         * export
		 */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any> {
            return [cmd, bytes, ip, port];
        }

		/**
		 * 数据接收拦截接口
         * export
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any> {
            return [cmd, srvId, bytes, data];
        }
    }
}