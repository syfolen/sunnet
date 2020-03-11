
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
                // 超时判定
                if (timestamp - this.$lastSendTime > Config.HEARTBEAT_TIMEOUT_MILLISECONDS) {
                    // 更新最新接收消息的时间，防止任务连续被派发
                    this.$lastRecvTime = this.$lastSendTime;
                    // 强行关闭网络连接
                    this.$connection.close(true);
                }
            }
            // 心跳己回复，则在指定的延时时间后发送心跳
            else if (timestamp - this.$lastSendTime > Config.HEARTBEAT_INTERVAL_MILLISECONDS) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    suncom.Logger.log("heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                }
                // 发送心跳
                const bytes: any = ProtobufManager.getInstance().encode("msg.Common_Heartbeat", { Cnt: 1 });
                this.$connection.sendBytes(Config.HEARTBEAT_REQUEST_COMMAND, bytes);
            }
        }

		/**
		 * 数据发送拦截接口
		 */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number, care: boolean): Array<any> {
            if (care === true) {
                if (Config.HEARTBEAT_FIXED_FREQUENCY === false || cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                    if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                        if (cmd === Config.HEARTBEAT_REQUEST_COMMAND) {
                            suncom.Logger.log("send heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                        }
                        else {
                            suncom.Logger.log("send bytes=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                        }
                    }
                    this.$lastSendTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
                }
            }
            return [cmd, bytes, ip, port, false];
        }

		/**
		 * 数据接收拦截接口
		 */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any> {
            if (Config.HEARTBEAT_FIXED_FREQUENCY === false || cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                    if (cmd === Config.HEARTBEAT_RESPONSE_COMMAND) {
                        suncom.Logger.log("recv heartbeat=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                    }
                    else {
                        suncom.Logger.log("recv bytes=> current timestamp:" + suncom.Common.formatDate("hh:mm:ss MS", new Date().valueOf()));
                    }
                }
                this.$lastRecvTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM);
            }
            return [cmd, srvId, bytes, data];
        }
    }
}