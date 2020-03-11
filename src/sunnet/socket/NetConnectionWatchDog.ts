
module sunnet {
    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     * export
     */
    export class NetConnectionWatchDog extends NetConnectionInterceptor {
        /**
         * 重连的服务器地址
         */
        private $ip: string;

        /**
         * 重连的服务器端口
         */
        private $port: number;

        /**
         * 重试机
         */
        private $retryer: sunui.IRetryer = null;

        constructor(connection: INetConnection) {
            super(connection);
            this.$retryer = new sunui.Retryer(
                sunui.RetryMethodEnum.CONFIRM,
                null,
                Config.NETWORK_ANOMALY_STRING,
                sunui.ConfirmOptionValueEnum.YES, "确定"
            );
            this.$connection.addEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
        }

        /**
         * 销毁拦截器
         */
        destroy(): void {
            this.$connection.removeEventListener(EventKey.KILL_WATCH_DOG, this.$onKillWatchDog, this);
            super.destroy();
        }

        /**
         * 当网络连接被建立时，需要取消并重置重连重试机
         */
        protected $onConnected(): void {
            this.$retryer.cancel();
            this.$retryer.reset();
        }

        /**
         * 网络连接断开回调，若因异常断开，则在1000毫秒后开始重连
         */
        protected $onDisconnected(byError: boolean): void {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`NetConnectionWatchDog=> 网络连接异常，${Config.TCP_RETRY_DELAY}毫秒后重连！`);
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$retryer.run(Config.TCP_RETRY_DELAY, suncom.Handler.create(this, this.$doConnect), Config.TCP_MAX_RETRIES);
            }
        }

        /**
         * 杀死检测狗
         */
        protected $onKillWatchDog(): void {
            this.$retryer.cancel();
        }

        /**
         * 重连执行函数
         */
        private $doConnect(): void {
            // 只有在网络处于未连接状态时才会进行重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.facade.sendNotification(NotifyKey.SOCKET_RETRY_CONNECT);
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(`检测狗不能正常工作，因为 state:${NetConnectionStateEnum[this.$connection.state]}`);
                }
            }
        }
    }
}