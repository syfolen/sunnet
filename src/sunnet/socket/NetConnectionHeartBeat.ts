
module sunnet {
    /**
     * 心跳检测器
     * export
     */
    export class NetConnectionHeartBeat extends NetConnectionInterceptor {

        /**
         * 上次发送数据的时间
         */
        private $lastSendTime: number;

        /**
         * 上次接收数据的时间
         */
        private $lastRecvTime: number;

		/**
		 * 当网络成功连接时，开始心跳
		 */
        protected $onConnected(): void {
            this.$lastRecvTime = this.$lastSendTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

		/**
		 * 连接断开后不再发送心跳
		 */
        protected $onDisconnected(): void {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

		/**
		 * 心跳验证
		 */
        private $onEnterFrame(): void {
            const timestamp: number = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            // 心跳未回复
            if (this.$lastRecvTime < this.$lastSendTime) {
                // 若时间己超过5秒，则视为网络掉线
                if (timestamp - this.$lastSendTime > 1000) {
                    // 更新最新接收消息的时间，防止任务连续被派发
                    this.$lastRecvTime = this.$lastSendTime;
                    // 强行关闭网络连接
                    this.$connection.close(true);
                }
            }
            // 若心跳己回复，则3秒后再次发送心跳
            else if (timestamp - this.$lastSendTime > 3000) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("send heatbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss", timestamp));
                }
                // 记录心跳被发送的时间
                this.$lastSendTime = timestamp;
                // 发送心跳
                const bytes: any = ProtobufManager.getInstance().encode("msg.Common_Heartbeat", { Cnt: 1 });
                this.$connection.sendBytes(Config.HEARTBEAT_REQUEST_COMMAND, bytes);
            }
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data?: any): Array<any> {
            if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                // 记录心跳响应的时间
                this.$lastRecvTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            return [cmd, srvId, bytes, data];
        }
    }
}