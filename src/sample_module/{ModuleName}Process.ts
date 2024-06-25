import * as path from "path";
import * as fs from "fs";
import { Process } from "./module_builder/Process";
import { IPCCallback } from "./module_builder/IPCObjects";
import { Setting } from "./module_builder/Setting";



export class SampleModuleProcess extends Process {

    private static readonly MODULE_NAME = "Sample Module";
    private static readonly MODULE_ID = "developer.Sample_Module";

    /** @htmlpath */
    private static readonly HTML_PATH: string = path.join(__dirname, "./{ModuleName}HTML.html").replace("dist", "src");

    public constructor(ipcCallback: IPCCallback) {
        super(
            SampleModuleProcess.MODULE_ID,
            SampleModuleProcess.MODULE_NAME,
            SampleModuleProcess.HTML_PATH,
            ipcCallback);
    }

    public initialize(): void {
        super.initialize();

        this.sendToRenderer('module-details', {
            name: SampleModuleProcess.MODULE_NAME,
            id: SampleModuleProcess.MODULE_ID
        });

        fs.promises.readdir(__dirname, { withFileTypes: true }).then((files: fs.Dirent[]) => {
            this.sendToRenderer('files', files);
        });


    }


    public registerSettings(): (Setting<unknown> | string)[] {
        return [];
    }


    public refreshSettings(modifiedSetting?: Setting<unknown>): void {
    }

    public stop(): void {
    }


    public handleEvent(eventType: string, data: any[]): void {
        switch (eventType) {
            case "init": {
                this.initialize();
                break;
            }
        }
    }

}