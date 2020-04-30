
module sunnet {
    /**
     * 微服务器
     * export
     */
    export namespace MicroServer {
        /**
         * 数据包列表
         */
        export const packets: Array<IMSWSPacket> = [];

        /**
         * 序列化WebSocket状态包
         * export
         */
        export function serializeWebSocketStatePacket(packet: IMSWSStatePacket): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                packet.kind = MSWSPacketKindEnum.STATE;
                packets.push(packet);
                initializePacket(packet);
                suncom.Test.expect(packet.state).interpret("必须指定WebSocket状态包的状态值").not.toBeUndefined();
            }
        }

        /**
         * 序列化WebSocket协议包
         * export
         */
        export function serializeWebSocketProtocalPacket(packet: IMSWSProtocalPacket): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                packet.kind = MSWSPacketKindEnum.PROTOCAL;
                packets.push(packet);
                initializePacket(packet);
            }
        }

        /**
         * 执行逻辑
         */
        export function run(): void {
            // 状态消息执行失败时，允许重新执行
            if (packets.length > 0 && notifyStatePacket(packets[0] as IMSWSStatePacket) === false && packets.length > 0) {
                const packet: IMSWSPacket = packets[0];
                if (packet.kind === MSWSPacketKindEnum.PROTOCAL) {
                    notifyProtocalPacket(packet);
                }
                else {
                    notifyProtocalPacket(packet);
                }
            }
        }

        /**
         * 初始化数据
         */
        function initializePacket(packet: IMSWSPacket): void {
            if (packet.delay === void 0) { packet.delay = 0; }
            if (packet.waitTimes === void 0) { packet.waitTimes = 1; }
            suncom.Test.expect(packet.delay).interpret("消息下行延时必须大于或等于0").toBeGreaterOrEqualThan(0);
            suncom.Test.expect(packet.waitTimes).interpret("消息上行等待次数必须大于0").toBeGreaterThan(0);
        }

        /**
         * 广播WebSocket状态消息
         */
        function notifyStatePacket(packet: IMSWSStatePacket): boolean {
            if (packet.kind === MSWSPacketKindEnum.STATE) {
                if (notYet(packet) === true) {
                    return false;
                }
            }
            return false;
        }

        /**
         * 广播WebSocket协议消息
         */
        function notifyProtocalPacket(packet: IMSWSProtocalPacket): void {

        }

        /**
         * 记录开始下行的时间戳
         */
        function markPacketTimestamp(packet: IMSWSPacket): void {
        }

        /**
         * 数据包未就绪
         */
        function notYet(packet: IMSWSPacket): boolean {
            if (packet.timestamp === void 0) { packet.timestamp = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM); }
            if (packet.timestamp + packet.delay > suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return false;
            }
            return true;
        }
    }
}