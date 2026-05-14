import { ProxyManagerClient, HostEntry, HTTPScheme } from "@theotherwillembotha/node-red-plugincore";
import { NginxClient } from "./client/NginxClient";
import { CreateProxyHostRequest, UpdateProxyHostRequest } from "./client/types";

export class NginxProxyManagerClient implements ProxyManagerClient {

    private readonly _client: NginxClient;

    constructor(url: string, email: string, password: string) {
        this._client = new NginxClient(url, email, password);
    }

    public async updateHost(data: Partial<HostEntry>): Promise<void> {
        const payload: Partial<CreateProxyHostRequest> = {};

        if (data.domainNames !== undefined)         { payload.domain_names           = data.domainNames; }
        if (data.scheme !== undefined)              { payload.forward_scheme          = data.scheme; }
        if (data.forwardHost !== undefined)         { payload.forward_host            = data.forwardHost; }
        if (data.forwardPort !== undefined)         { payload.forward_port            = data.forwardPort; }
        if (data.cacheAssets !== undefined)         { payload.caching_enabled         = data.cacheAssets; }
        if (data.blockCommonExploits !== undefined) { payload.block_exploits          = data.blockCommonExploits; }
        if (data.websocketSupport !== undefined)    { payload.allow_websocket_upgrade = data.websocketSupport; }

        if (data.id) {
            await this._client.updateProxyHost(data.id, payload as UpdateProxyHostRequest);
        } else {
            await this._client.createProxyHost(payload as CreateProxyHostRequest);
        }
    }

    public async getHosts(): Promise<Partial<HostEntry>[]> {
        const hosts = await this._client.listProxyHosts();
        return hosts.map(h => ({
            id:          h.id,
            domainNames: h.domain_names,
            scheme:      h.forward_scheme as HTTPScheme,
            forwardHost: h.forward_host,
            forwardPort: h.forward_port,
        }));
    }
}
