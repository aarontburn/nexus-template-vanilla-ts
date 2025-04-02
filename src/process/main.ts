import * as path from "path";
import * as fs from "fs";
import { Process, Setting } from "@nexus/nexus-module-builder"
import { BooleanSetting, ChoiceSetting, HexColorSetting, NumberSetting, StringSetting } from "@nexus/nexus-module-builder/settings/types";

// These is replaced to the ID specified in export-config.js during export. DO NOT MODIFY.
const MODULE_ID: string = "{EXPORTED_MODULE_ID}";
const MODULE_NAME: string = "{EXPORTED_MODULE_NAME}";
// ---------------------------------------------------
const HTML_PATH: string = path.join(__dirname, "../renderer/index.html");


export default class SampleProcess extends Process {

    /**
     *  The constructor. Should not directly be called, 
     *      and should not contain logic relevant to the renderer.
     */
    public constructor() {
        super(MODULE_ID, MODULE_NAME, HTML_PATH);

        // Verify the module has been initialized. Can be removed.
        setTimeout(() => {
            if (!this.isInitialized()) {
                console.error("Error: has not received signal from renderer. Verify the MODULE_ID matches the renderers.");
                console.error("\tListening to: " + MODULE_ID);
            }
        }, 3000);
    }

    /**
     *  The entry point of the module. Will be called once the 
     *      renderer sends the 'init' signal.
     */
    public initialize(): void {
        super.initialize(); // This should be called.

        this.sendToRenderer('module-details', {
            name: MODULE_NAME,
            id: MODULE_ID,
            folderName: __dirname.split("\\").at(-1)
        });

        fs.promises.readdir(__dirname, { withFileTypes: true }).then((files: fs.Dirent[]) => {
            this.sendToRenderer('files', files);
        });
    }


    public registerSettings(): (Setting<unknown> | string)[] {
        return [
            "Sample Setting Group",
            new BooleanSetting(this)
                .setDefault(false)
                .setName("Sample Toggle Setting")
                .setDescription("An example of a boolean setting!")
                .setAccessID('sample_bool'),


            "Selection Settings",
            new ChoiceSetting(this)
                .addOptions("Apple", "Orange", "Banana", "Kiwi")
                .setName("Example Default Choice Setting")
                .setDescription("This is an example of the ChoiceSetting as radio buttons.")
                .setDefault("Banana"),

            new ChoiceSetting(this)
                .useDropdown()
                .addOptions("Blueberry", "Raspberry", "Pineapple", "Grape")
                .setName("Example Choice Setting as a Dropdown")
                .setDescription("This is an example of the ChoiceSetting as a dropdown!")
                .setDefault("Grape"),


            "Numeric Settings",
            new NumberSetting(this)
                .setName("Example Default Number Setting")									// Set name (required)
                .setDescription("This is the default numeric setting.")						// Set description
                .setDefault(5),																// Set default value (required)

            new NumberSetting(this)
                .useNonIncrementableUI()														// Use the non-incrementable UI
                .setName("Example Non-Incrementable Number Setting")
                .setDescription("This is a numeric setting WITHOUT the + or - buttons.")
                .setDefault(5),

            new NumberSetting(this)
                .useRangeSliderUI()															// Use the slider UI
                .setName("Example Slider Number Setting")
                .setDescription("This is a numeric setting as a slider.")
                .setDefault(5),

            new NumberSetting(this)
                .setRange(5, 25)																// Define a lower and upper bound
                .setStep(5)																	// Define the increment amount (default is 1)
                .setName("Example Number Setting with bounds")
                .setDescription("This is a numeric setting confined to a range of [5, 25].")
                .setDefault(10),

            new NumberSetting(this)
                .setMin(15)																	// Define a lower bound
                .setName("Example Number Setting with a lower-bound")
                .setDescription("This is a numeric setting confined to a range of [15, ∞).")
                .setDefault(25),

            new NumberSetting(this)
                .setMax(100)																	// Define an upper bound
                .setName("Example Number Setting with an upper-bound")
                .setDescription("This is a numeric setting confined to a range of (-∞, 100].")
                .setDefault(45),


            "Boolean Setting",
            new BooleanSetting(this)
                .setName("Example Boolean Setting")
                .setDescription("This is the setting to manage boolean state.")
                .setDefault(false),


            "Color Setting",
            new HexColorSetting(this)
                .setName("Example Color Setting")
                .setDescription("This is a setting to manage color!")
                .setDefault("#74f287"),


            "String Setting",
            new StringSetting(this)
                .setName("Example String Setting")
                .setDescription("This is a setting to take text input from the user!")
                .setDefault("Example Text"),




        ];
    }


    public refreshSettings(modifiedSetting: Setting<unknown>): void {
        if (modifiedSetting.getAccessID() === 'sample_bool') {
            this.sendToRenderer('sample-setting', modifiedSetting.getValue());
        }
    }

    public async handleEvent(eventType: string, data: any[]): Promise<any> {
        switch (eventType) {
            case "init": {
                // This case is required to properly receive the initialization signal
                //      from the renderer.
                this.initialize();
                break;
            }
        }
    }

}