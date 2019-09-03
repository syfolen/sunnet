
module sunnet {

    export class BuildProtoTask extends suncore.AbstractTask {

        private $url: string;

        constructor(url: string) {
            super();
            this.$url = url;
        }

        run(): boolean {
            Laya.Browser.window.protobuf.load(this.$url, this.$onLoadProto.bind(this));
            return false;
        }

        private $onLoadProto(error: any, root: any): void {
            ProtobufManager.addProto(root);
            this.done = true;
        }
    }
}