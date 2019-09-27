
class ProtobufDecoder extends sunnet.NetConnectionProtobufDecoder {

    /**
     * 数据解析执行函数
     */
    protected $decode(cmd: number, bytes: Uint8Array): any {
        if (cmd === 1) {
            return sunnet.ProtobufManager.getInstance().decode("msg.LoginTest", bytes);
        }
        if (cmd === 2) {
            return sunnet.ProtobufManager.getInstance().decode("msg.LoginRet", bytes);
        }
        return null;
    }

}