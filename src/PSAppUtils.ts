
abstract class PSAppUtils {

    private static inst: sunnet.INetConnection = new sunnet.NetConnection("default");

    static getInstance(): sunnet.INetConnection {
        return PSAppUtils.inst;
    }

}