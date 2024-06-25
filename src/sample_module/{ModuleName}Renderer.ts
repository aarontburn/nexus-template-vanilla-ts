/**
 * Renderer process
 */

(() => { // Wrapped in an anonymous function for scoping.

    const MODULE_ID = "developer.Sample_Module";

    const sendToProcess = (eventType: string, ...data: any): void => {
        window.parent.ipc.send(MODULE_ID, eventType, ...data);
    }


    // Instruct module process to initialize once the renderer is ready.
    sendToProcess("init");



    const defaultModuleID = 'developer.Sample_Module';
    const defaultModuleName = 'Sample Module'

    window.parent.ipc.on(MODULE_ID, async (_, eventType: string, ...data: any[]) => {
        switch (eventType) {
            case 'module-details': {
                const obj: { name: string, id: string } = data[0];
                const name: string = obj.name;
                const id: string = obj.id;

                document.getElementById('module-name').innerText = name;
                document.getElementById('module-id').innerText = id;

                if (name === defaultModuleName) {
                    document.getElementById('name-default-warning').hidden = false;
                }
                if (id === defaultModuleID) {
                    document.getElementById('id-default-warning').hidden = false;
                }
                break;
            }
            case 'files': {
                const files: { name: string, path: string }[] = data[0];

                const fileBox: HTMLElement = document.getElementById('file-box');
                const descriptions: Map<string, string> = getDescriptions(files);
                descriptions.forEach((desc, name) => {
                    const html: string = `
                        <tr>
                            <td class='table-left'><h3>${name}</h3></td>
                            <td style='vertical-align: top;'><h3>←</td>
                            <td><p>${desc}</p></td>
                        </tr>
                    `
                    fileBox.insertAdjacentHTML('beforeend', html)
                });


                break;
            }

        }
    });

    function c(text: string, color?: string): string {
        return `<span ${color ? `style='color: ${color}'` : ''}>${text}</span>`
    }


    function getDescriptions(files: { name: string, path: string }[]): Map<string, string> {
        const getFile = (s: string): { name: string, path: string } => {
            for (const file of files) {
                if (file.name.includes(s)) {
                    return file;
                }
            }
            return undefined;
        }

        const output: Map<string, string> = new Map();
        files.forEach(file => {
            const name: string = file.name;
            let desc: string = "No description set";
            if (name.includes('Process')) {
                if (name.includes('{ModuleName}')) {
                    desc = `${c("[RENAME]", 'red')} This is the backend of your module. Replace ${c('"{ModuleName}"')}, but ensure it ends with ${c('"{Process}"')}!`;
                } else {
                    desc = 'This is the backend of your module, where you have access to all Node.js packages, but no access to the DOM.';
                }
            } else if (name.includes('Renderer')) {
                if (name.includes('{ModuleName}')) {
                    desc = `${c("[RENAME]", 'red')} This is the "frontend's-backend" of the module. Replace ${c('"{ModuleName}"')}, but ensure it ends with ${c('"{Renderer}"')}!`;
                } else {
                    desc = `This is the "frontend's-backend". This has access to the DOM, but no access to Node.js packages.`;
                }
            } else if (name.includes('.css')) {
                const html: { name: string, path: string } = getFile('.html');
                if (name.includes('{ModuleName}')) {
                    desc = `${c("[RENAME]", 'red')} The styling for the HTML. Rename this, and make sure you modify head of the the HTML file ${html ? `(${c(`"${html.name}"`)})` : ''} to properly update it.`;
                } else {
                    desc = `The styling for the HTML.`;
                }
            } else if (name.includes('.html')) {
                const process: { name: string, path: string } = getFile('Process');
                if (name.includes('{ModuleName}')) {
                    desc = `${c("[RENAME]", 'red')} The frontend. Rename this, and update the ${c('"HTML_PATH"')} variable in the process ${process ? `(${c(`"${process.name}"`)})` : ''} to properly update it.`;
                } else {
                    desc = `The frontend. Modify this as you would with any other HTML file!`;
                }
            } else if (name === 'moduleinfo.json') {
                desc = 'This is where some information about your module is stored. Edit this!';

            } else if (name === 'module_builder') {
                desc = `${c("[IGNORE]", 'yellow')} This is where required files are stored. Do not modify any files in this folder and ignore it.`;

            } else if (name === 'node_modules') {
                desc = `${c("[IGNORE]", 'yellow')} This folder holds external dependencies, if your module requires them. Ignore this folder.`;
            }
            output.set(name, desc);

        });
        return output;



    }

})();

