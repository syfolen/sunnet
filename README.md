# sunnet

## 网络封装库，封装了与 WebSocket 相关的功能

***

## 常用特性列举

#### NetConnection 长连接对象

* 实现了长连接的建立、断开、网络数据读取与发送等逻辑

* 维护长连接的状态

* 当你想连接 WebSocket 服务端时，请创建该类的实例

* 更多请参考 NetConnection

#### NetConnectionCreator

* 你可以直接调用 NetConnection 的 sendBytes 来发送数据而不用先执行 connect ，因为有 Creator存在

* 同样，当你要切换服务器时，也可以直接向新的服务器发送数据

* Creator 内置了连接和切换服务器的逻辑

* 更多请参考 NetConnectionCreator

#### NetConnectionDecoder

* 网络消息解码器

#### NetConnectionEncoder

* 网络消息编码器

#### NetConnectionHeartbeat 

* 网络心跳执行器，专门用于检测网络是否己掉线

#### NetConnectionProtobufDecoder

* Protobuf 消息解析器

#### NetConnectionWatchDog

* 网络状态检测狗，专门用于处理掉线重连

***

## 网络封装库的实现

#### NetConnectionPipeline

* 网络数据传输管道（基于责任链模式实现）

* 当 NetConnection 响应数据，或外部通过 sendBytes 发送数据时，数据都会进入 Pipeline 进行传输

* 范例：见 Main.ts
