
module sunnet {
    /**
     * 时序片断
     * export
     */
    export abstract class SequentialSlice extends puremvc.Notifier {
        /**
         * 哈希值
         */
        protected $hashId: number = suncom.Common.createHashId();

        constructor() {
            super();
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

        /**
         * 释放时序片断
         * export
         */
        release(): void {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

        /**
         * 帧事件回调
         * export
         */
        protected abstract $onEnterFrame(): void;

        /**
         * 获取时序片断哈希值
         */
        get hashId(): number {
            return this.$hashId;
        }
    }
}