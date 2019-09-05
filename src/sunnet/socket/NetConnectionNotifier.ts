
module sunnet {

    /**
     * 网络消息派发器
     */
    export abstract class NetConnectionNotifier {

        private static readonly inst: suncom.IEventSystem = new suncom.EventSystem();

        /**
         * 通知网络消息
         */
        static notify(cmd: number, data: any): void {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`NetConnectionNotifier=> notify cmd:${cmd.toString(16)}, data:${JSON.stringify(data)}`);
            }
            NetConnectionNotifier.inst.dispatchEvent(cmd.toString(), data);
        }

        /**
         * 注册网络消息监听
         */
        static register(cmd: number, method: Function, caller: Object): void {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`NetConnectionNotifier=>register cmd:${cmd.toString(16)}`);
            }
            NetConnectionNotifier.inst.addEventListener(cmd.toString(), method, caller);
        }

        /**
         * 移除网络消息监听
         */
        static unregister(cmd: number, method: Function, caller: Object): void {
            if ((suncom.Global.debugMode & suncom.DebugMode.NETWORK) === suncom.DebugMode.NETWORK) {
                suncom.Logger.log(`NetConnectionNotifier=>unregister cmd:${cmd.toString(16)}`);
            }
            NetConnectionNotifier.inst.removeEventListener(cmd.toString(), method, caller);
        }
    }
}