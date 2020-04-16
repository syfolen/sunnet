
module sunnet {
    /**
     * 数据中心
     */
    export namespace M {
        /**
         * 包头长度
         */
        export const HEAD_LENGTH: number = 28;

        /**
         * 网络连接哈希表
         */
        export const connetionMap: { [name: string]: INetConnection } = {};

        /**
         * 逻辑时序列表
         */
        export const seqLogicSliceList: SequentialLogicSlice[] = [];
    }
}