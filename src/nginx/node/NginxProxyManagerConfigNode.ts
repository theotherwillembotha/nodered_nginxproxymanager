
import { Node } from "node-red";
import { ConfigNode, ConfigNodeConfig, SourceUtility, NodeDescription, UIHelperTemplate } from "@theotherwillembotha/node-red-plugincore";
import { NginxProxyManagerClient } from "../service/NginxProxyManagerClient";

interface NginxProxyManagerConfigNodeConfig extends ConfigNodeConfig {
    url: string;
    email: string;
    password: string;
}

@NodeDescription({
    id:"NginxProxyManagerConfigNode",
    name:"Nginx Proxy Manager Config",
    group:"config",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "NginxProxyManagerConfigNode.html",
    package: "@theotherwillembotha/nodered_nginxproxymanager",
    tags: [ "ReverseProxyType" ],
    templates: [
        { template: UIHelperTemplate, config: {} }
    ]
})
export class NginxProxyManagerConfigNode extends ConfigNode<NginxProxyManagerConfigNodeConfig> {
    
    private _client!: NginxProxyManagerClient;
    
    constructor(node: Node, config: NginxProxyManagerConfigNodeConfig){
        super(node, config);
        let _this = this;

        this._client = new NginxProxyManagerClient(config.url, config.email, config.password);
    }

    public client(): NginxProxyManagerClient {
        return this._client;
    }
}
