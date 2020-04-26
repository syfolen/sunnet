
module sunnet {
    /**
     * 时间时序接口
     * export
     */
    export interface ISequentialTimeSlice extends ISequentialSlice {
        /**
         * 时间流逝的倍率
         * export
         */
        timeMultiple: number;

        /**
         * 更新对象的创建时间
         * @createTime: 创建时间（服务端时间），默认为当前服务端时间
         * @pastTime: 默认过去时长
         * @chaseMultiple: 追帧时的时间倍率，默认为：1
         * export
         */
        updateCreateTime(createTime?: number, pastTime?: number, chaseMultiple?: number): void;

        /**
         * 获取当前服务端时间戳
         * export
         */
        getCurrentServerTimestamp(): number;

        /**
         * 对象的生命时长
         * export
         */
        readonly timeLen: number;

        /**
         * 对象过去的时间
         * export
         */
        readonly pastTime: number;
    }
}