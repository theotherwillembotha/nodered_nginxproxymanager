import { NodeGenerator, NodeTypeService } from "@theotherwillembotha/node-red-plugincore";

import { NginxProxyManagerConfigNode, UpdateNginxHostNode, NginxGetHostsNode } from "./index.js";

// Only register leaf nodes and NodeTypeService.
// All infrastructure (services, templates, DelegatedConfigReferenceNode)
// is resolved automatically from @NodeDescription and @TemplateDescription
// dependency chains.
new NodeGenerator("./src/nginx/")
    .registerService(NodeTypeService)
    .registerNode(NginxProxyManagerConfigNode)
    .registerNode(UpdateNginxHostNode)
    .registerNode(NginxGetHostsNode)
    .generate("./build/Nodes", "./build/Plugins", "@theotherwillembotha/node-red-nginxproxymanager");

process.exit(0);
