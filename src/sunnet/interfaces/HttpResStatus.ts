
module sunnet {
    /**
     * Http请求结果状态
     */
    export enum HttpResStatus {
        /**
         * 正常
         */
        OK = 0,

        /**
         * 读取结果出错
         */
        IO_ERROR = -1,

        /**
         * 解析结果出错
         */
        PARSE_ERROR = -2
    }
}