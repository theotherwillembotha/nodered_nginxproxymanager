import { NodeAPI, NodeAPISettingsWithData } from "node-red";
import { BaseService, ServiceDescriptor } from "@theotherwillembotha/node-red-plugincore"
import { NginxClient } from "./client/NginxClient";
import { NginxApiError } from "./client/NginxHttpClient";

type NginxConnection = {
    url:string,
    username:string,
    password:string
}

type TestConnectionRequest = {
    connection: NginxConnection
}

type ProxyHostSummary = {
    id: number;
    domain_names: string[];
    forward_host: string;
    forward_port: number;
    forward_scheme: string;
    enabled: boolean;
}


export class NginxProxyManagerService extends BaseService {

    private red!: NodeAPI<NodeAPISettingsWithData>;

    constructor(){
        super("NginxProxyManagerService");
    }

    init(red: NodeAPI<NodeAPISettingsWithData>): void {
        console.log("STARTING: " + this.name());
        this.red = red;

        this.red.httpAdmin.post("/nginxproxymanagerservice/testconnection", this.red.auth.needsPermission("inject.write"), async (req, response) => {
            const { url, username, password } = (req.body as TestConnectionRequest).connection;

            if (!url || !username || !password) {
                response.status(400).send({ error: "url, username and password are required" });
                return;
            }
            try {
                const client = new NginxClient(url, username, password);
                await client.testConnection();
                response.status(200).send({ message: "Connection successful" });
            } 
            catch (e) {
                if (e instanceof NginxApiError) {
                    try{
                        let errorMessage = JSON.parse(e.apiMessage).error.message;
                        response.status(e.statusCode).send({ error: errorMessage });
                    }
                    catch(parseError) {
                        response.status(e.statusCode).send({ error: e.apiMessage });
                    }
                } 
                else {
                    let errorMessage = (e as Error).message ?? "Unknown error";
                    if(errorMessage === "fetch failed"){
                        errorMessage = "Invalid URL / URL not reachable";
                    }
                    response.status(400).send({ error:  errorMessage});
                }
            }
        });

        this.red.httpAdmin.post("/nginxproxymanagerservice/hosts", this.red.auth.needsPermission("inject.write"), async (req, response) => {
            const { url, username, password } = (req.body as TestConnectionRequest).connection;

            if (!url || !username || !password) {
                response.status(400).send({ error: "url, username and password are required" });
                return;
            }

            try {
                const client = new NginxClient(url, username, password);
                const raw = await client.listProxyHosts();
                const proxyHosts: ProxyHostSummary[] = raw.map(h => ({
                    id:           h.id,
                    domain_names: h.domain_names,
                    forward_host: h.forward_host,
                    forward_port: h.forward_port,
                    forward_scheme: h.forward_scheme,
                    enabled:      h.enabled,
                }));
                response.status(200).send({ hosts: { proxyHosts } });
            } 
            catch (e) {
                if (e instanceof NginxApiError) {
                    try {
                        const errorMessage = JSON.parse(e.apiMessage).error.message;
                        response.status(e.statusCode).send({ error: errorMessage });
                    } 
                    catch {
                        response.status(e.statusCode).send({ error: e.apiMessage });
                    }
                } 
                else {
                    let errorMessage = (e as Error).message ?? "Unknown error";
                    if (errorMessage === "fetch failed") {
                        errorMessage = "Invalid URL / URL not reachable";
                    }
                    response.status(400).send({ error: errorMessage });
                }
            }
        });
    }

    deinit(red: NodeAPI<NodeAPISettingsWithData>): void {
        console.log("STOPPING SERVICE: " + this.name());
    }

    static override getServiceDescriptor():ServiceDescriptor {
        return new ServiceDescriptor(
            "@theotherwillembotha/nginxproxymanagerservice",
            "NginxProxyManagerService", 
            "integration-plugin",
            "./nginx/service/NginxProxyManagerService",
            NginxProxyManagerService);
    }
}