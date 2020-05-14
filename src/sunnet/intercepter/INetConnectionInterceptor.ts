
module sunnet {
    /**
     * 网络消息拦截器接口
     * export
     */
    export interface INetConnectionInterceptor extends puremvc.INotifier {

        /**
         * 数据发送拦截接口
         * export
         */
        send(cmd: number, bytes: Uint8Array, ip: string, port: number): Array<any>;

        /**
         * 数据接收拦截接口
         * export
         */
        recv(cmd: number, srvId: number, bytes: Uint8Array, data: any): Array<any>;
    }
}