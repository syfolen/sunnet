
module sunnet {

    export interface IPSAppUtils {

        /**
         * @byError: 是否因网络错误原因被关闭，默认为false
         */
        close(byError?: boolean);
    }
}