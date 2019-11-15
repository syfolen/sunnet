
module sunnet {

    /**
     * 网络状态检测狗
     * 用于检测网络是否掉线
     */
    export class NetConnectionWatchDog extends NetConnectionInterceptor {

        /**
         * 重连定时器
         */
        private $timerId: number;

        /**
         * 重连的服务器地址
         */
        private $ip: string;

        /**
         * 重连的服务器端口
         */
        private $port: number;

        /**
         * 重连次数
         */
        private $retryCount: number = 0;

        constructor(connection: INetConnection) {
            super(connection);
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
         * 当网络连接被建立时，需要移除检测狗
         */
        protected $onConnected(): void {
            this.$retryCount = 0;
            this.$onKillWatchDog();
        }

        /**
         * 网络连接断开回调，若因异常断开，则在1000毫秒后开始重连
         */
        protected $onDisconnected(byError: boolean): void {
            if (byError === true) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) === suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(`NetConnectionWatchDog=> 网络连接异常，1000毫秒后重连！`);
                }
                if (this.$retryCount >= Config.TCP_MAX_RETRY_TIME) {
                    puremvc.Facade.getInstance().sendNotification(NotifyKey.SOCKET_STATE_CHANGE, 2);
                    return;
                }
                this.$ip = this.$connection.ip;
                this.$port = this.$connection.port;
                this.$timerId = suncore.System.addTimer(suncore.ModuleEnum.SYSTEM, Config.TCP_RETRY_DELAY, this.$onDoingConnect, this);
            }
        }

        /**
         * 杀死检测狗
         */
        protected $onKillWatchDog(): void {
            this.$timerId = suncore.System.removeTimer(this.$timerId);
        }

        /**
         * 重连
         */
        private $onDoingConnect(): void {
            // 只有在网络处于未连接状态时才会进行重连
            if (this.$connection.state === NetConnectionStateEnum.DISCONNECTED) {
                this.$retryCount++;
                this.$connection.connect(this.$ip, this.$port, true);
            }
            else {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("检测狗不能正常工作，因为：", "state:" + suncom.Common.convertEnumToString(this.$connection.state, NetConnectionStateEnum));
                }
            }
        }
    }
}