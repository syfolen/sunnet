
module sunnet {
    /**
     * 网络消息派发器
     * export
     */
    export namespace MessageNotifier {
        /**
         * 消息派发器
         */
        const $inst: suncom.IEventSystem = new suncom.EventSystem();

        /**
         * 通知网络消息
         * export
         */
        export function notify(name: string, data: any): void {
            $inst.dispatchEvent(name, data);
        }

        /**
         * 注册网络消息监听
         * export
         */
        export function register(name: string, method: Function, caller: Object): void {
            $inst.addEventListener(name, method, caller);
        }

        /**
         * 移除网络消息监听
         * export
         */
        export function unregister(name: string, method: Function, caller: Object): void {
            $inst.removeEventListener(name, method, caller);
        }
    }
}