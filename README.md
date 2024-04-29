# Modules: Developer Template
Developer template required to develop modules for [modules](https://github.com/aarontburn/modules)

# Prerequisites:
- Node?
- Typescript?

# Template Installation
To start, clone the template and do 
```
    npm install
```
to install any required packages.

# Getting Started
![image](https://github.com/aarontburn/modules-module_develop/assets/103211131/a5770453-b34a-42f1-9e67-3a9c9347e922)

This is what the initial template should look like. All assets related to your module should remain within the `sample_module` directory.

Do not modify the contents of `module_builder` or any other files, as those changes will not be saved when used in the main application.

## Strict Naming and @Annotations
There are rules of this application that MUST be followed. One of which is certain names.

### Strict Names: 
Notated in this document as **[STRICT]**, certain files MUST be named a specific way, or else the main application will become confused when compiling your module.


Notated in this document as **[NOT STRICT]**, this is for files that can be renamed to whatever the developer wants, but must be consistent (obviously). 

### @Annotations
Inspired by Java's Annotations, there are several locations in the template that have an @annotation before it. These annotations **must be present in order to properly compile your plugin.**

All required annotations are already in the template, and you shouldn't need to add any additional ones. 


Example 1: [{MODULE_NAME}HTML.html](https://github.com/aarontburn/modules-module_develop/blob/main/src/sample_module/%7BMODULE_NAME%7DHTML.html)
```
    ...
    <!-- @css -->
    <link rel="stylesheet" href="../../colors.css">
    ...
```

Example 2: [{MODULE_NAME}Module.ts](https://github.com/aarontburn/modules-module_develop/blob/main/src/sample_module/%7BMODULE_NAME%7DModule.ts)  

```
    ...
    // Modify this to match the path of your HTML file.
    /** @htmlpath */
    private static HTML_PATH: string = path.join(__dirname, "./{MODULE_NAME}HTML.html").replace("dist", "src");
    ...
```
When compiling your module, the main application will look for the @annotations and, when found, will directly modify the next line. This means, unless specified, the line directly under an @annotation **must remain on a single line.**

Valid HTML, but will break compiling:
```
    ...
    <!-- @css -->
    <link 
        rel="stylesheet" 
        href="../../colors.css">
    ...
```


## Renaming
To be safe, rename all `{MODULE_NAME}` to the same thing.

1. Rename the `sample_module` directory to the name of your module. 
2. Rename `{MODULE_NAME}.css` to a proper name. **[NOT STRICT]**
3. Rename `{MODULE_NAME}Renderer.ts` to a proper name.
4. Rename `{MODULE_NAME}Module.ts` to a proper name.  
\* This file **MUST** end with `Module.ts
5. Rename `{MODULE_NAME}HTML.html` to a proper name.
6. In `{MODULE_NAME}HTML.html`, modify the CSS `<link>`  `href`'s location to the name of your CSS file (in step 2).
```
    <!-- Modify this for the name to the name of your CSS file. -->
    <link rel="stylesheet" href="{MODULE_NAME}.css">
```

7. In `{MODULE_NAME}HTML.html`, modify the `<script>`'s `src` to point towards your renderer. Rename `sample_module` to the name of the directory (from step 1) and `{MODULE_NAME}Renderer` to the name of your renderer (from step 3).

```
    <!-- Note: This script tag NEEDS to stay a single line. -->
    <!-- @renderer -->
    <script defer src="../../dist/sample_module/{MODULE_NAME}Renderer.js"></script>

```

8. In `{MODULE_NAME}Module.ts`, modify the `MODULE_NAME` variable to the name of your module and the `HTML_PATH`variable to point towards your HTML file (from step 5).
```
    // Modify this to the name of your module.
    private static MODULE_NAME = "{MODULE_NAME}"; // SHOULD MATCH RENDERER

    // Modify this to match the path of your HTML file.
    /** @htmlpath */
    private static HTML_PATH: string = path.join(__dirname, "./{MODULE_NAME}HTML.html").replace("dist", "src");
```

9. In `{MODULE_NAME}Renderer.ts`, modify the `MODULE_NAME` variable to EXACTLY what you modifed the `MODULE_NAME` variable in step 8.
```
    // Change this to EXACTLY what is in the {MODULE_NAME}Module.MODULE_NAME field.
    const MODULE_NAME = "{MODULE_NAME}" // SHOULD MATCH MODULE
```

10. In `ModuleController.ts`, modify the import statement to properly import your `{MODULE_NAME}Module` file.
```
    // Update this import statement
    import { SampleModule } from "./sample_module/{MODULE_NAME}Module";
```

## Running the application
After modifying the specified files, you should be ready to start developing your module. 

In the terminal, execute the command:
```
    npm start
```
![image](https://github.com/aarontburn/modules-module_develop/assets/103211131/4aff1dc8-d286-4414-a57f-6b408f3903ed)  
If no exceptions are thrown, and the terminal looks similar to this, you have correctly installed and renamed things.


# Developing your Module
## Quick Tips:
1. Electron is Chromium based. That means you have access to the Chrome Developer tools, either through the menu bar (`View > Toggle Developer Tools`), or by keyboard shortcut (`CTRL + SHIFT + I`)


## Module Structure `{MODULE_NAME}Module.ts`
The module file is the backend of your module. It has full access to Node packages. It does not have direct access to the frontend - you will need to communicate and send data to the frontend and do the updating there.


## Renderer Structure `{MODULE_NAME}Renderer.ts`
The renderer file is the frontend of your module. It has **NO ACCESS** to Node packages, including `require` or `import`.

It does have access to the DOM. You should send data from the Module, recieve it in the Renderer, and use that information to update the frontend. 



## Communicating between Module and Renderer
Electron uses Inter-Process Communication (IPC) to communicate between the module and renderer. There are pre-defined functions in both the module and renderer file to simplify this process.

### Module
#### Sending an event TO the Renderer
```
    public notifyObservers(eventType: string, ...data: any): void { ... }
    
    this.notifyObservers("{EVENT_NAME}", {EVENT_DATA_1}, {EVENT_DATA_2}, ...);
```
This function is used by the module to communicate to the renderer.  

`eventType`: A name for the event.  
`...data`: Data to send to the renderer, if any.
#### Receiving an event FROM the Renderer
```
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
```

This function receives events from the renderer.  
`eventType`: The name of the event.  
`data`: All data passed from the renderer, if any.

### Renderer
#### Sending an event TO the Module
```
    const sendToProcess = (eventType: string, ...data: any): void => {
        window.parent.ipc.send(MODULE_PROCESS_NAME.toLowerCase(), eventType, data);
    }
    
    sendToProcess("sample_event_from_renderer", "sample data 1", "sample data 2");

```
#### Receiving an event FROM the Module
```
    window.parent.ipc.on(MODULE_RENDERER_NAME, (_, eventType: string, data: any[]) => {
        data = data[0]; // Data is wrapped in an extra array.
        switch (eventType) {
            case "sample_event": {
                console.log("Received from process: " + data);
                sendToProcess("sample_event_from_renderer", "sample data 1", "sample data 2");
                break;
            }
        }
    });
```







