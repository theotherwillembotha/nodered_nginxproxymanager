import { BaseService, ReverseProxyTypeService, ServiceDescriptor } from "@theotherwillembotha/nodered_plugincore";
import { NodeAPI, NodeAPISettingsWithData } from "node-red";
import { NginXReverseProxyType } from "./NginxReverseProxyType";

export class NginxReverseProxyService extends BaseService {

    private red!: NodeAPI<NodeAPISettingsWithData>;

        constructor(){
        super("NginxReverseProxyService");
    }

    public init(red: NodeAPI<NodeAPISettingsWithData>): Promise<void> {
        this.red = red;

        let listener = async (pluginID:String) => {
            if(pluginID === "@theotherwillembotha/reverseproxytypesservice"){
                console.log("PLUGIN: " + pluginID + " installed!. Processing NginxReverseProxyService");
                red.events.off('plugin.instantiated', listener)

                let plugin  = this.red.plugins.get("@theotherwillembotha/reverseproxytypesservice") as any;
                let reverseProxyPluginService: ReverseProxyTypeService = (this.red.plugins.get("@theotherwillembotha/reverseproxytypesservice") as any).instance as ReverseProxyTypeService;
                reverseProxyPluginService.registerReverseProxyType(new NginXReverseProxyType());
            }
        }

        // check if the reverserproxyttypesewrvice is installed yet.
        let plugin  = this.red.plugins.get("@theotherwillembotha/reverseproxytypesservice") as any;
        if(plugin){
            // the required plugin is already installed. install the service
            let reverseProxyPluginService: ReverseProxyTypeService = plugin.instance as ReverseProxyTypeService;
            reverseProxyPluginService.registerReverseProxyType(new NginXReverseProxyType());
        }
        else{ 
            // Register a listener to trigger when the RegerseProxyTypService gets installed.
            console.log("reverseproxytypesservice not installed yet. waiting for it to be installed");
            red.events.on('plugin.instantiated', listener);
        }

        return Promise.resolve();
    }

    public deinit(red: NodeAPI<NodeAPISettingsWithData>): Promise<void> {
        return Promise.resolve();
    }

    static override getServiceDescriptor():ServiceDescriptor {
        return new ServiceDescriptor(
            "@theotherwillembotha/nodered_nginxproxymanager",
            "NginxReverseProxyService",
            "services-plugin",
            "./nginx/service/NginxReverseProxyService",
            NginxReverseProxyService,
            []
        );
    }
}