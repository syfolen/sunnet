/**
 * @license sunnet (c) 2013 Binfeng Sun <christon.sun@qq.com>
 * Released under the MIT License
 * https://blog.csdn.net/syfolen
 * https://github.com/syfolen/sunnet
 * export
 */
module sunnet {
    /**
     * 网络连接对象
     * export
     */
    export class NetConnection extends NetConnectionAdapter {
        /**
         * 是否因为连接错误而关闭
         */
        private $closedByError: boolean = false;

        /**
         * 请求连接
         * @byDog: 是否由检测狗发起，默认为false
         * export
         */
        connect(ip: string, port: number, byDog: boolean): void {
            const byError: boolean = byDog === false ? false : this.$closedByError;
            this.close(byError);

            this.$ip = ip;
            this.$port = port;
            this.$state = NetConnectionStateEnum.CONNECTING;

            this.$socket = new Laya.Socket();
            this.$socket.endian = Laya.Byte.LITTLE_ENDIAN;
            this.$socket.on(Laya.Event.OPEN, this, this.$onOpen);
            this.$socket.on(Laya.Event.CLOSE, this, this.$onClose);
            this.$socket.on(Laya.Event.ERROR, this, this.$onError);
            this.$socket.on(Laya.Event.MESSAGE, this, this.$onMessage);
            this.$socket.connectByUrl("ws://" + ip + ":" + port);

            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`Netconnection=> 请求连接 ws://${this.$ip}:${this.$port}`);
            }
            // 模拟断开网络
            this.addEventListener(EventKey.CLOSE_CONNECT_BY_VIRTUAL, this.$onError, this);
            // 通知网络状态变更
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
        }

        /**
         * 关闭 websocket
         * @byError: 是否因为网络错误而关闭，默认为false
         * export
         */
        close(byError: boolean = false): void {
            // 主动断网
            if (byError === false) {
                this.$closedByError = false;
            }
            // 非正常断网时，若网络己处于连接状态，则标记为异常断开
            else if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$closedByError = true;
                this.dispatchEvent(EventKey.CLEAR_REQUEST_DATA);
            }

            if (this.$socket !== null) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(`Netconnection=> 关闭连接 ws://${this.$ip}:${this.$port}`);
                }

                // 清除 socket 事件侦听
                this.$socket.off(Laya.Event.OPEN, this, this.$onOpen);
                this.$socket.off(Laya.Event.CLOSE, this, this.$onClose);
                this.$socket.off(Laya.Event.ERROR, this, this.$onError);
                this.$socket.off(Laya.Event.MESSAGE, this, this.$onMessage);

                // 关闭 socket
                this.$socket.close();
                this.$socket = null;
            }

            // 若当前网络未处于断开状态，则派发网络断开事件
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.dispatchEvent(EventKey.SOCKET_DISCONNECTED, byError);
            }

            // 非异常断网时，不需要自动重连
            if (byError === false) {
                this.dispatchEvent(EventKey.KILL_WATCH_DOG);
            }

            // 通知网络状态变更
            if (this.$state !== NetConnectionStateEnum.DISCONNECTED) {
                this.$state = NetConnectionStateEnum.DISCONNECTED;
                this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
            }
        }

        /**
         * 发送二进制数据
         */
        send(bytes: Uint8Array): void {
            if (this.$state === NetConnectionStateEnum.CONNECTED) {
                this.$socket.send(bytes);
            }
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.error("NetConnection=> sendBytes 发送数据失败！！！");
            }
        }

        /**
         * 发送数据
         * @bytes: 只能是Uint8Array，默认为：null
         * @ip: 目标地址，默认为：null
         * @port: 目标端口，默认为：0
         * export
         */
        sendBytes(cmd: number, bytes: Uint8Array = null, ip: string = null, port: number = 0): void {
            this.$pipeline.send(cmd, bytes, ip, port);
        }

        /**
         * 发送数据
         */
        flush(): void {
            this.$socket.flush();
        }

        /**
         * 连接成功
         */
        private $onOpen(): void {
            this.$state = NetConnectionStateEnum.CONNECTED;
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 网络连接成功！");
            }
            // 网络重连成功
            this.dispatchEvent(EventKey.SOCKET_CONNECTED);

            // 不再缓存正在发送的数据流
            this.dispatchEvent(EventKey.CACHE_SEND_BYTES, false);
            // 发送所有当前己缓存的数据流
            this.dispatchEvent(EventKey.FLUSH_CACHED_BYTES);

            // 重置异常关闭的标记
            this.$closedByError = false;
            this.facade.sendNotification(NotifyKey.SOCKET_STATE_CHANGE, [this.$name, this.$state]);
        }

        /**
         * 连接断开
         */
        private $onClose(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常关闭！");
            }
            this.close(true);
        }

        /**
         * 连接异常
         */
        private $onError(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                suncom.Logger.log("Netconnection=> 连接异常断开！");
            }
            this.close(true);
        }

        /**
         * 响应数据
         */
        private $onMessage(event: Laya.Event): void {
            this.$pipeline.recv(0, 0, null, void 0);
        }
    }
}