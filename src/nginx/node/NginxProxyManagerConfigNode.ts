
import { Node } from "node-red";
import { ConfigNode, ConfigNodeConfig, NodeDescriptor, SourceUtility } from "@theotherwillembotha/nodered_plugincore";
import { NginxProxyManagerClient } from "../service/NginxProxyManagerClient";

interface NginxProxyManagerConfigNodeConfig extends ConfigNodeConfig {
    url: string;
    email: string;
    password: string;
}

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

    static override getNodeDescriptor():NodeDescriptor {
        return new NodeDescriptor(
            "config", 
            "NginxProxyManagerConfigNode",
            SourceUtility.getSourcePath("/build/", "/src/") + "NginxProxyManagerConfigNode.html",
            "@theotherwillembotha/nodered_nginxproxymanager"
        );
    }
}
