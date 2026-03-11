import { Node } from "node-red";
import { BaseNode, BaseNodeConfig, InputService, NodeDescriptor, NodeManager, SourceUtility } from "@theotherwillembotha/nodered_plugincore";
import { Metrics, MetricType, MetricsTemplate, CounterMetric, MetricsTemplateConfig } from "@theotherwillembotha/nodered_plugincore";
import { Log, Logger, LoggerTemplate, LoggerTemplateConfig } from "@theotherwillembotha/nodered_plugincore";
import { NginxProxyManagerClient } from "../service/NginxProxyManagerClient";
import { NginxProxyManagerConfigNode } from "./NginxProxyManagerConfigNode";


interface UpdateHostNodeConfig extends BaseNodeConfig, MetricsTemplateConfig, LoggerTemplateConfig {
    proxymanagerconfig:string;
}

class UpdateHostNode extends BaseNode<UpdateHostNodeConfig> {

    @Logger()
    private log!:Log;
    
    @Metrics({name:"request",type:MetricType.Counter, description:"number of requests made"})
    private counter!:CounterMetric;
    private _client: NginxProxyManagerClient;

    constructor(node: Node, config: UpdateHostNodeConfig){
        super(node, config);
        let _this = this;

        // get a reference to the NGINXPROXYMANAGER client.
        this._client = ((NodeManager.RED.nodes.getNode(config.proxymanagerconfig) as any).node() as NginxProxyManagerConfigNode).client();

        InputService.create(this, config, async (message, errorHandler) => {
            this.log.log(message);
            this.counter.inc();
            await this._client.updateHost(message.payload);
            this.node().send(message);
        });
    }

    static override getNodeDescriptor():NodeDescriptor {
        return new NodeDescriptor(
            "nginxproxymanager", 
            "UpdateHostNode", 
            SourceUtility.getSourcePath("/build/", "/src/") + "UpdateHostNode.html",
            "@theotherwillembotha/nodered_nginxproxymanager")
        .addDependency(NginxProxyManagerConfigNode)
        .addTemplate(LoggerTemplate, {})
        .addTemplate(MetricsTemplate, {});
    }
}

export {
    UpdateHostNodeConfig,
    UpdateHostNode
}