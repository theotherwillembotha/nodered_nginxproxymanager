import { CreateProxyHostPayload, NpmClient, ProxyHost, UpdateProxyHostPayload } from "nginx-proxy-manager-sdk";

export class NginxProxyManagerClient {
    private connection: NpmClient;

    constructor(url:string, email:string, password:string){
        console.log(url, email, password);
        this.connection = new NpmClient({baseUrl:url, email:email, password:password});
    }

    public async updateHost(data: Partial<HostEntry>):Promise<void> {

        let proxyHost:Partial<CreateProxyHostPayload> = {};
        if(data.domainNames !== undefined)          { proxyHost.domain_names = data.domainNames; }
        if(data.scheme !== undefined)               { proxyHost.forward_scheme = data.scheme; }
        if(data.forwardHost !== undefined)          { proxyHost.forward_host = data.forwardHost; }
        if(data.forwardPort !== undefined)          { proxyHost.forward_port = data.forwardPort; }
        //if(data.accessList !== undefined)         { update.access_list_id = data.accessList; }
        if(data.cacheAssets !== undefined)          { proxyHost.caching_enabled = data.cacheAssets; }
        if(data.blockCommonExploits !== undefined)  { proxyHost.block_exploits = data.blockCommonExploits; }
        if(data.websocketSupport !== undefined)     { proxyHost.allow_websocket_upgrade = data.websocketSupport; }

        if(data.id){
            
            try{
                let result = await this.connection.proxyHosts.get(data.id);
                await this.connection.proxyHosts.update(data.id, proxyHost);
                return Promise.resolve();
            }
            // the api actually throws an exception if it could not found the host by id.
            catch(e) {}
        }

        await this.connection.proxyHosts.create(proxyHost as CreateProxyHostPayload);
    }

    private static merge(source:{[key:string]:string}, target:{[key:string]:string}, mapping:{[key:string]:string}):void{
        Object.entries(mapping).forEach(([key, value]) => {
            if(source[key] !== null) { target[value] === source[key] }
        });
    }
}

export type HostEntry = {
    id:number,
    domainNames:string[],
    scheme:HTTPScheme,
    forwardHost:string,
    forwardPort:number,
    accessList:string,
    cacheAssets:boolean,
    blockCommonExploits:boolean,
    websocketSupport:boolean,

}

export enum HTTPScheme{
    HTTP = "http",
    HTTPS = "https"
}