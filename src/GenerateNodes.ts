import { NodeGenerator } from "@theotherwillembotha/nodered_plugincore"

import { NginxProxyManagerConfigNode, UpdateHostNode } from "./index.js";

new NodeGenerator("./src/")
    // services.

    // nodes
    .registerNode(NginxProxyManagerConfigNode)
    .registerNode(UpdateHostNode)
    
    // done.
    .generate("./build/Nodes", "./build/Plugins");

process.exit(0);