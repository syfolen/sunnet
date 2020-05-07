
module sunnet {
    /**
     * 网络消息派发器
     * export
     */
    export namespace MessageNotifier {
        /**
         * 消息派发器
         */
        const $notifier: suncom.IEventSystem = new suncom.EventSystem();

        /**
         * 通知网络消息
         * export
         */
        export function notify(name: string, data: any, cancelable?: boolean): void {
            if (name === "msg.Common_Heartbeat") {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK_HEARTBEAT) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "响应心跳");
                }
            }
            else if (Config.VIRTUAL_NETWORK_LEVEL === VirtualNetworkLevelEnum.NONE) {
                if (suncom.Global.debugMode & suncom.DebugMode.NETWORK) {
                    suncom.Logger.log(suncom.DebugMode.ANY, "响应消息 name:" + name + ", data:" + JSON.stringify(data));
                }
            }
            $notifier.dispatchEvent(name, data, cancelable);
        }

        /**
         * 注册网络消息监听
         * export
         */
        export function register(name: string, method: Function, caller: Object, priority?: number): void {
            $notifier.addEventListener(name, method, caller, false, priority);
        }

        /**
         * 移除网络消息监听
         * export
         */
        export function unregister(name: string, method: Function, caller: Object): void {
            $notifier.removeEventListener(name, method, caller);
        }
    }
}