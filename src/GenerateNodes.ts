import { NodeGenerator } from "@theotherwillembotha/node-red-plugincore";

import { NginxProxyManagerService, NginxProxyManagerConfigNode, UpdateNginxHostNode, NginxGetHostsNode } from "./index.js";

new NodeGenerator("./src/")
    // services.
    .registerService(NginxProxyManagerService)

    // nodes
    .registerNode(NginxProxyManagerConfigNode)
    .registerNode(UpdateNginxHostNode)
    .registerNode(NginxGetHostsNode)
    
    // done.
    .generate("./build/Nodes", "./build/Plugins");

process.exit(0);
