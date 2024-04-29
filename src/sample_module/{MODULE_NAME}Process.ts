import * as path from "path";
import { Process } from "./module_builder/Process";
import { IPCCallback } from "./module_builder/IPCObjects";
import { Setting } from "./module_builder/Setting";


export class SampleProcess extends Process {

    // Modify this to the name of your module.
    private static MODULE_NAME = "{MODULE_NAME}";

    // Modify this to match the path of your HTML file.
    /** @htmlpath */
    private static HTML_PATH: string = path.join(__dirname, "./{MODULE_NAME}HTML.html").replace("dist", "src");

    public constructor(ipcCallback: IPCCallback) {
        super(SampleProcess.MODULE_NAME, SampleProcess.HTML_PATH, ipcCallback);
    }

    public initialize(): void {
        super.initialize();
        // If this isn't printed, that means the renderer is never initialized.
        console.log(SampleProcess.MODULE_NAME.toLowerCase() + "-process has been initialized.");


        // Initialize your module.
        this.notifyObservers('sample_event', 'arg 1')
    }

    public registerSettings(): Setting<unknown>[] {
        return [];
    }
    public refreshSettings(): void {

    }

    public recieveIpcEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "init": {
                this.initialize();
                break;
            }
            case "sample_event_from_renderer": {
                console.log("Received from renderer: " + data);
                break;
            }

        }
    }


}