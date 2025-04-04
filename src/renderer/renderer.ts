window.parent.ipc.on(window, (eventType: string, data: any[]) => {
    handleEvent(eventType, data);
});

/**
 *  Sends information to the the process.
 * 
 *  @param eventType    The name of the event.
 *  @param data         Any data to send.
 */
const sendToProcess = (eventType: string, ...data: any[]): Promise<void> => {
    return window.parent.ipc.send(window, eventType, data);
}


// Instruct the module process to initialize once the renderer is ready.
sendToProcess("init");


/**
 *  Handle events from the process.
 */
const handleEvent = (eventType: string, data: any[]) => {
    switch (eventType) {
        case 'sample-setting': {
            const html: HTMLElement = document.getElementById('counter-display');

            html.style.color = data[0] ? 'green' : 'red';
            html.innerText = data[0] ? 'on' : 'off'
            break;
        }
    }
}


let counter = 0;
const setCounter = (count: number) => {
    counter = count;
    document.getElementById("counter").innerHTML = `count is ${counter}`;
}
setCounter(0);

document.getElementById("counter").addEventListener("click", () => setCounter(counter + 1));
document.getElementById("counter-button").addEventListener("click", () => sendToProcess("count", counter));

