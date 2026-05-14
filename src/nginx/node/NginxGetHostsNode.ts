import { Node } from "node-red";
import { BaseNode, BaseNodeConfig, NodeDescription, NodeManager, onInput, SourceUtility } from "@theotherwillembotha/node-red-plugincore";
import { Metrics, MetricType, MetricsTemplate, CounterMetric, MetricsTemplateConfig } from "@theotherwillembotha/node-red-plugincore";
import { Log, Logger, LoggerTemplate, LoggerTemplateConfig } from "@theotherwillembotha/node-red-plugincore";
import { NginxProxyManagerClient } from "../service/NginxProxyManagerClient";
import { NginxProxyManagerConfigNode } from "./NginxProxyManagerConfigNode";

interface NginxGetHostsNodeConfig extends BaseNodeConfig, MetricsTemplateConfig, LoggerTemplateConfig {
    proxymanagerconfig: string;
    outputpath: string;
}

@NodeDescription({
    id: "NginxGetHostsNode",
    name: "Nginx Get Hosts",
    group: "nginxproxymanager",
    sourceFile: SourceUtility.getSourcePath("/build/", "/src/") + "NginxGetHostsNode.html",
    package: "@theotherwillembotha/nodered_nginxproxymanager",
    templates: [
        { template: LoggerTemplate, config: {} },
        { template: MetricsTemplate, config: {} }
    ],
    dependencies: [ NginxProxyManagerConfigNode ],
    tags: [ "Nginx" ]
})
export class NginxGetHostsNode extends BaseNode<NginxGetHostsNodeConfig> {

    @Logger()
    private log!: Log;

    @Metrics({ name: "get_hosts_requests", type: MetricType.Counter, description: "number of get hosts requests made" })
    private counter!: CounterMetric;

    private _client: NginxProxyManagerClient;

    constructor(node: Node, config: NginxGetHostsNodeConfig) {
        super(node, config);
        this._client = ((NodeManager.RED.nodes.getNode(config.proxymanagerconfig) as any).node() as NginxProxyManagerConfigNode).client();
    }

    @onInput()
    protected async onInput(message: { [key: string]: any }, errorHandler: Function) {
        this.log.log(message);
        this.counter.inc();

        const hosts = await this._client.getHosts().catch(e => { errorHandler(e); return null; });
        if (hosts === null) return;

        const outputPath = this.config().outputpath || "payload";
        NodeManager.RED.util.setMessageProperty(message, outputPath, hosts);

        this.node().send(message);
    }
}
