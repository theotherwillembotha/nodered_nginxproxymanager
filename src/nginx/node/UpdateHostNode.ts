import { Node } from "node-red";
import { BaseNode, BaseNodeConfig, NodeDescription, NodeManager, onInput, SourceUtility } from "@theotherwillembotha/node-red-plugincore";
import { Metrics, MetricType, MetricsTemplate, CounterMetric, MetricsTemplateConfig } from "@theotherwillembotha/node-red-plugincore";
import { Log, Logger, LoggerTemplate, LoggerTemplateConfig } from "@theotherwillembotha/node-red-plugincore";
import { NginxProxyManagerClient } from "../service/NginxProxyManagerClient";
import { NginxProxyManagerConfigNode } from "./NginxProxyManagerConfigNode";


interface UpdateNginxHostNodeConfig extends BaseNodeConfig, MetricsTemplateConfig, LoggerTemplateConfig {
    proxymanagerconfig:string;
}

@NodeDescription({
    id:"UpdateNginxHostNode",
    name:"Update Nginx Host",
    group:"nginxproxymanager",
    sourceFile:SourceUtility.getSourcePath("/build/", "/src/") + "UpdateHostNode.html",
    package: "@theotherwillembotha/nodered_nginxproxymanager",
    templates: [
        { template: LoggerTemplate, config: {}},
        { template: MetricsTemplate, config: {}}
    ],
    dependencies: [ NginxProxyManagerConfigNode ],
    tags: [ "NiginX", "ReverseProxy" ]
})
export class UpdateNginxHostNode extends BaseNode<UpdateNginxHostNodeConfig> {

    @Logger()
    private log!:Log;
    
    @Metrics({name:"request",type:MetricType.Counter, description:"number of requests made"})
    private counter!:CounterMetric;
    private _client: NginxProxyManagerClient;

    constructor(node: Node, config: UpdateNginxHostNodeConfig){
        super(node, config);
        let _this = this;

        // get a reference to the NGINXPROXYMANAGER client.
        this._client = ((NodeManager.RED.nodes.getNode(config.proxymanagerconfig) as any).node() as NginxProxyManagerConfigNode).client();
    }

    @onInput()
    protected async onInput(message:{[key:string]:any}, errorHandler:Function){
        this.log.log(message);
        this.counter.inc();
        await this._client.updateHost(message.payload).catch(e => errorHandler(e));
        this.node().send(message);
    }
}