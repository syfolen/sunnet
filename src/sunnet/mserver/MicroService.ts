
module sunnet {
    /**
     * 微服务器服务
     */
    export class MicroService extends suncore.BaseService {

        /**
         * 启动回调
         */
        protected $onRun(): void {

        }

        /**
         * 停止回调
         */
        protected $onStop(): void {

        }

        /**
         * 帧循环事件（请重写此方法来替代ENTER_FRAME事件）
         */
        protected $frameLoop(): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                if (suncom.Test.ENABLE_MICRO_SERVER === true) {
                    sunnet.MicroServer.run();
                }
            }
        }
    }
}