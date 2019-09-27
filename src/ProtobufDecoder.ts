
class ProtobufDecoder extends sunnet.NetConnectionProtobufDecoder {

    /**
     * 数据解析执行函数
     */
    protected $decode(cmd: number, buffer: ArrayBuffer): any {
        // if (cmd === ProtocalEnum.LOGIN_RSP) {
        //     return sunnet.ProtobufManager.decode("msg.LoginRet", new Uint8Array(buffer));
        // }
        if (cmd === 1) {
            return sunnet.ProtobufManager.decode("msg.LoginTest", new Uint8Array(buffer));
        }
        if (cmd === 2) {
            return sunnet.ProtobufManager.decode("msg.LoginRet", new Uint8Array(buffer));
        }
        return null;
    }

}