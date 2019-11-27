
module sunnet {
    /**
     * 网络消息拦截器
     * 自定义拦截器需要继承此类
     * export
     */
    export abstract class NetConnectionInterceptor implements INetConnectionInterceptor {

        protected $connection: INetConnection;

        constructor(connection: INetConnection) {
            this.$connection = connection;
            this.$connection.addEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.addEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
        }

        /**
         * 销毁拦截器
         */
        destroy(): void {
            this.$connection.removeEventListener(EventKey.SOCKET_CONNECTED, this.$onConnected, this);
            this.$connection.removeEventListener(EventKey.SOCKET_DISCONNECTED, this.$onDisconnected, this);
            this.$connection = null;
        }

        /**
         * 网络连接成功
         */
        protected $onConnected(): void {

        }

        /**
         * 网络连接断开
         */
        protected $onDisconnected(byError: boolean): void {

        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes?: Uint8Array, ip?: string, port?: number): Array<any> {
            return [cmd, bytes, ip, port];
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            return [cmd, srvId, bytes, data];
        }
    }
}