
module sunnet {
    /**
     * 时序接口
     * export
     */
    export interface ISequentialSlice extends puremvc.Notifier {

        /**
         * 释放时序片断
         * export
         */
        release(): void;

        /**
         * 获取时序片断哈希值
         */
        readonly hashId: number;
    }
}