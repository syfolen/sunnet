
module sunnet {
    /**
     * 微服务器
     * export
     */
    export namespace MicroServer {
        /**
         * 数据包列表
         */
        export const packets: IMSWSPacket[] = [];

        /**
         * 客户端与服务端的时差
         */
        export const timeDiff: number = suncom.Common.random(-8000, 8000);

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
                const out: suncore.ITestSeqInfo = { seqId: 0 };
                puremvc.Facade.getInstance().sendNotification(suncom.NotifyKey.TEST_PROTOCAL, [packet.kind, 1, "reg", out]);
                packet.seqId = out.seqId;
            }
        }

        /**
         * 序列化WebSocket协议包
         * @timeFileds: 若有值，则视为时间偏移
         * @hashFileds: 无论是否有值，哈希值均会被重写
         * export
         */
        export function serializeWebSocketProtocalPacket(packet: IMSWSProtocalPacket, timeFields?: string[], hashFields?: string[]): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                packet.kind = MSWSPacketKindEnum.PROTOCAL;
                packets.push(packet);
                initializePacket(packet);
                if (packet.data === void 0) { packet.data = null; }
                if (packet.replyName === void 0) { packet.replyName = null; }
                if (packet.repeatTimes === void 0) { packet.repeatTimes = 1; }
                initializePacketDefaultValue(packet, timeFields, hashFields);
                suncom.Test.expect(packet.repeatTimes).interpret("消息的下行次数必须大于或等于1").toBeGreaterOrEqualThan(1);
                const out: suncore.ITestSeqInfo = { seqId: 0 };
                puremvc.Facade.getInstance().sendNotification(suncom.NotifyKey.TEST_PROTOCAL, [packet.kind, packet.repeatTimes, "reg", out]);
                packet.seqId = out.seqId;
            }
        }

        /**
         * 执行逻辑
         */
        export function run(): void {
            while (packets.length > 0) {
                const packet: IMSWSPacket = packets[0];
                let success: boolean = false;
                if (packet.kind === MSWSPacketKindEnum.STATE) {
                    success = notifyStatePacket(packet as IMSWSStatePacket);
                }
                else {
                    success = notifyProtocalPacket(packet as IMSWSProtocalPacket);
                }
                if (success === false) {
                    break;
                }
                if (packets.length > 0 && packets[0].asNewMsg === true) {
                    break;
                }
            }
        }

        /**
         * 接收客户端消息
         */
        export function recv(cmd: number): void {
            if (suncom.Global.debugMode & suncom.DebugMode.TEST) {
                if (suncom.Test.ENABLE_MICRO_SERVER === true) {
                    if (packets.length > 0) {
                        const packet: IMSWSPacket = packets[0];
                        const protocal: { Name: string } = ProtobufManager.getInstance().getProtocalByCommand(cmd);
                        if (packet.waitName === protocal.Name && packet.waitTimes > 0) {
                            packet.waitCount++;
                            if (packet.waitCount === packet.waitTimes) {
                                run();
                            }
                        }
                    }
                }
            }
        }

        /**
         * 广播WebSocket状态消息
         */
        function notifyStatePacket(packet: IMSWSStatePacket): boolean {
            suncom.Test.assertTrue(packet.kind === MSWSPacketKindEnum.STATE);

            const connection: INetConnection = M.connetionMap[packet.connName] || null;
            if (connection === null) {
                return false;
            }
            // 网络未连接时，不会下行任何状态数据包
            if (connection.state === NetConnectionStateEnum.DISCONNECTED) {
                return false;
            }
            if (notYet(packet) === true) {
                return false;
            }
            if (connection.state === NetConnectionStateEnum.CONNECTING) {
                suncom.Test.assertTrue(packet.state === MSWSStateEnum.CONNECTED || packet.state === MSWSStateEnum.ERROR, `当前网络正在连接，仅允许下行CONNECTED或ERROR状态`);
            }
            else if (connection.state === NetConnectionStateEnum.CONNECTED) {
                suncom.Test.assertTrue(packet.state === MSWSStateEnum.CLOSE || packet.state === MSWSStateEnum.ERROR, `当前网络己连接，仅允许下行CLOSE或ERROR状态`);
            }
            packets.shift();
            connection.testChangeState(packet.state);
            puremvc.Facade.getInstance().sendNotification(suncom.NotifyKey.TEST_PROTOCAL, [packet.kind, 1, "exe"]);
            return true;
        }

        /**
         * 广播WebSocket协议消息
         */
        function notifyProtocalPacket(packet: IMSWSProtocalPacket): boolean {
            suncom.Test.assertTrue(packet.kind === MSWSPacketKindEnum.PROTOCAL);
            if (notYet(packet) === true) {
                return false;
            }
            if (packet.repeatTimes === 1) {
                packets.shift();
            }
            const connection: INetConnection = M.connetionMap[packet.connName] || null;
            suncom.Test.expect(connection).not.toBeNull();
            initializePacketValue(packet);
            connection.testProtocal(packet.replyName, packet.data);
            if (packet.repeatTimes > 1) {
                packet.repeatTimes--;
                packet.waitCount = 0;
                delete packet.createTime;
            }
            puremvc.Facade.getInstance().sendNotification(suncom.NotifyKey.TEST_PROTOCAL, [packet.kind, 1, "exe"]);
            return true;
        }

        /**
         * 数据包未就绪
         */
        function notYet(packet: IMSWSPacket): boolean {
            if (packet.seqId !== suncore.TestTask.currentTestSeqId) {
                return true;
            }
            if (packet.waitName !== null && packet.waitCount < packet.waitTimes) {
                return true;
            }
            if (packet.createTime === void 0) { packet.createTime = suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM); }
            if (packet.createTime + packet.delay > suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return true;
            }
            if (packet.asNewMsg === true && packet.createTime + packet.delay === suncore.System.getModuleTimestamp(suncore.ModuleEnum.SYSTEM)) {
                return true;
            }
            return false;
        }

        /**
         * 初始化数据
         */
        function initializePacket(packet: IMSWSPacket): void {
            if (packet.delay === void 0) { packet.delay = 0; }
            if (packet.connName === void 0) { packet.connName = "default"; }
            if (packet.asNewMsg === void 0) { packet.asNewMsg = true; }
            if (packet.waitName === void 0) { packet.waitName = null; }
            if (packet.waitTimes === void 0) { packet.waitTimes = 1; }
            suncom.Test.expect(packet.seqId).toBeUndefined();
            packet.waitCount = 0;
            suncom.Test.expect(packet.delay).interpret("消息下行延时必须大于或等于0").toBeGreaterOrEqualThan(0);
            suncom.Test.expect(packet.waitTimes).interpret("消息上行等待次数必须大于0").toBeGreaterThan(0);
        }

        /**
         * 初始化数据包的默认值
         */
        function initializePacketDefaultValue(packet: IMSWSProtocalPacket, timeFields: string[] = [], hashFields: string[] = []): void {
            if (packet.data === null) {
                return;
            }
            packet.hashFileds = hashFields;
            packet.timeFields = [];
            for (let i: number = 0; i < timeFields.length; i++) {
                const value: dcodeIO.Long = getFieldValue(packet.data, timeFields[i], dcodeIO.Long.fromNumber(0));
                packet.timeFields.push({
                    arg1: value.toNumber(),
                    arg2: timeFields[i]
                });
            }
        }

        /**
         * 初始化数据包的值
         */
        function initializePacketValue(packet: IMSWSProtocalPacket): void {
            if (packet.data === null) {
                return;
            }
            for (let i: number = 0; i < packet.hashFileds.length; i++) {
                setFieldValue(packet.data, packet.hashFileds[i], suncom.Common.createHashId());
            }
            for (let i: number = 0; i < packet.timeFields.length; i++) {
                const timeFiled: IPCMIntString = packet.timeFields[i];
                setFieldValue(packet.data, timeFiled.arg2, dcodeIO.Long.fromNumber(new Date().valueOf() + timeFiled.arg1));
            }
        }

        /**
         * 获取指定字段的值
         */
        function getFieldValue(data: any, field: string, defaultValue: any): any {
            const array: string[] = field.split(".");
            while (array.length > 0) {
                data = data[array.shift()];
            }
            return data === void 0 ? defaultValue : data;
        }

        /**
         * 设置指定字段的值
         */
        function setFieldValue(data: any, field: string, value: any): void {
            const array: string[] = field.split(".");
            while (array.length > 1) {
                data = data[array.shift()];
            }
            data[array.shift()] = value;
        }
    }
}