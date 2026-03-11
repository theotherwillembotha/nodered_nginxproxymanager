import { ReverseProxyClient, ReverseProxyType } from "@theotherwillembotha/nodered_plugincore";

export class NginXReverseProxyType extends ReverseProxyType {

    constructor(){
        super("NginxProxyManagerConfigNode", "Nginx Proxy Manager")
    }
}