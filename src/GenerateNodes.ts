import {
    NodeGenerator,
    LoggerService, LoggerTemplate,
    DelegatedConfigReferenceNode, ConsoleLoggerConfigNode, RestLoggerConfigNode,
    MetricsService, MetricsTemplate,
    MetricsConfigNode, CounterMetricConfigNode, GaugeMetricConfigNode, TimerMetricConfigNode,
    SettingsService, NodeTypeService, BasicTemplate,
} from "@theotherwillembotha/node-red-plugincore";

import { NginxProxyManagerService, NginxProxyManagerConfigNode, UpdateNginxHostNode, NginxGetHostsNode } from "./index.js";

new NodeGenerator("./src/nginx/")
    // plugincore services bundled inline — deduplicated at runtime via RED.plugins.get()
    .registerService(LoggerService)
    .registerService(MetricsService)
    .registerService(SettingsService)
    .registerService(NodeTypeService)
    // templates are build-time only
    .registerTemplate(BasicTemplate)
    .registerTemplate(LoggerTemplate)
    .registerTemplate(MetricsTemplate)
    // plugincore infrastructure nodes — registered here so nginx works standalone.
    // Server-side: global guard in NodeManagerRuntime prevents double-registration.
    // Client-side: registry:node-set-added deferred pattern in Plugins.html is idempotent.
    .registerNode(DelegatedConfigReferenceNode)
    .registerNode(ConsoleLoggerConfigNode)
    .registerNode(RestLoggerConfigNode)
    .registerNode(MetricsConfigNode)
    .registerNode(CounterMetricConfigNode)
    .registerNode(GaugeMetricConfigNode)
    .registerNode(TimerMetricConfigNode)
    // nginx-owned nodes
    .registerService(NginxProxyManagerService)
    .registerNode(NginxProxyManagerConfigNode)
    .registerNode(UpdateNginxHostNode)
    .registerNode(NginxGetHostsNode)

    // done.
    .generate("./build/Nodes", "./build/Plugins");

process.exit(0);
