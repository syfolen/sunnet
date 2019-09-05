
class ProtobufDecoder extends sunnet.NetConnectionProtobufDecoder {

    /**
     * 数据解析执行函数
     */
    protected $decode(cmd: number, buffer: ArrayBuffer): any {
        if (cmd === 2) {
            return sunnet.ProtobufManager.decode("msg.ProtoTest2", new Uint8Array(buffer));
        }
        return null;
    }

}