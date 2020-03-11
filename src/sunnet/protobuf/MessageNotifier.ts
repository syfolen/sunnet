
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
        export function notify(name: string, data: any): void {
            $notifier.dispatchEvent(name, data);
        }

        /**
         * 注册网络消息监听
         * export
         */
        export function register(name: string, method: Function, caller: Object): void {
            $notifier.addEventListener(name, method, caller);
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