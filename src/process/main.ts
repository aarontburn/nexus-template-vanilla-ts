import * as path from "path";
import { Process, Setting } from "@nexus/nexus-module-builder"
import { BooleanSetting } from "@nexus/nexus-module-builder/settings/types";

// These is replaced to the ID specified in export-config.js during export. DO NOT MODIFY.
const MODULE_ID: string = "{EXPORTED_MODULE_ID}";
const MODULE_NAME: string = "{EXPORTED_MODULE_NAME}";
// ---------------------------------------------------
const HTML_PATH: string = path.join(__dirname, "../renderer/index.html");

// const ICON_PATH: string = path.join(__dirname, "...")
const ICON_PATH: string = undefined;


export default class SampleProcess extends Process {

    /**
     *  The constructor. Should not directly be called, 
     *      and should not contain logic relevant to the renderer.
     */
    public constructor() {
		super({
			moduleID: MODULE_ID,
			moduleName: MODULE_NAME,
			paths: {
				htmlPath: HTML_PATH,
                iconPath: ICON_PATH
			}
		});
    }

    /**
     *  The entry point of the module. Will be called once the 
     *      renderer sends the 'init' signal.
     * 
     */
    public async initialize(): Promise<void> {
        await super.initialize(); // This should be called.

    }


    public registerSettings(): (Setting<unknown> | string)[] {
        return [
            "Sample Setting Group",
            new BooleanSetting(this)
                .setDefault(false)
                .setName("Sample Toggle Setting")
                .setDescription("An example of a boolean setting!")
                .setAccessID('sample_bool')
        ];
    }


    public async onSettingModified(modifiedSetting: Setting<unknown>): Promise<void> {
        if (modifiedSetting.getAccessID() === 'sample_bool') {
            this.sendToRenderer('sample-setting', modifiedSetting.getValue());
        }
    }

    public async handleEvent(eventName: string, data: any[]): Promise<any> {
        switch (eventName) {
            case "init": {
                // This case is required to properly receive the initialization signal
                //      from the renderer.
                this.initialize();
                break;
            }

            case "count": {
                console.log(MODULE_NAME + ": Received 'count': " + data[0]);
                break;
            }

            default: {
                console.warn(`Uncaught event: eventName: ${eventName} | data: ${data}`)
                break;
            }
        }
    }

}