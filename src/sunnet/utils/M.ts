
module sunnet {
    /**
     * 数据中心
     */
    export namespace M {
        /**
         * 时序服务对象
         */
        export let service: SequentialService = null;

        /**
         * 逻辑时序列表
         */
        export const seqLogicSliceList: SequentialLogicSlice[] = [];
    }
}