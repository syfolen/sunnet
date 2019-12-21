
abstract class PSAppUtils {

    private static inst: sunnet.INetConnection = null;
    
    static getInstance(): sunnet.INetConnection {
        if (PSAppUtils.inst === null) {
            PSAppUtils.inst = new sunnet.NetConnection("default");
        }
        return PSAppUtils.inst;
    }

}