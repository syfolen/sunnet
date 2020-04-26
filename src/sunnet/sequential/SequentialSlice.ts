
module sunnet {
    /**
     * 时序片断
     * export
     */
    export abstract class SequentialSlice extends puremvc.Notifier implements ISequentialSlice {
        /**
         * 哈希值
         */
        protected $hashId: number = suncom.Common.createHashId();

        protected $destroyed: boolean = false;

        constructor() {
            super();
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrameCB, this, false, suncom.EventPriorityEnum.FWL);
        }

        /**
         * 释放时序片断
         * export
         */
        release(): void {
            if (this.$destroyed === true) {
                return;
            }
            this.$destroyed = true;
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrameCB, this);
        }

        /**
         * export
         */
        private $onEnterFrameCB(): void {
            if (this.$destroyed === false) {
                this.$onEnterFrame();
            }
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