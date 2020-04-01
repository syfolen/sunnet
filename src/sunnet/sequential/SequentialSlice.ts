
module sunnet {
    /**
     * 时序片断
     * export
     */
    export abstract class SequentialSlice extends puremvc.Notifier {
        /**
         * 时序ID
         */
        private $SEQ_ID: number = 0;

        /**
         * 哈希值
         */
        private $hashId: number = suncom.Common.createHashId();

        constructor(id: number) {
            super();
            this.$SEQ_ID = id;
            this.facade.registerObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
        }

        /**
         * 释放时序片断
         * export
         */
        release(): void {
            this.facade.removeObserver(suncore.NotifyKey.ENTER_FRAME, this.$onEnterFrame, this);
            this.facade.sendNotification(NotifyKey.SEQUENTIAL_SLICE_RELEASED, this.$hashId);
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

        /**
         * 时序ID
         */
        get SEQ_ID(): number {
            return this.$SEQ_ID;
        }
    }
}