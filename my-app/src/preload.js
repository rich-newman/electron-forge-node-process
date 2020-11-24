const { contextBridge } = require('electron');
const { ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('myAPI', {
    runTest: () => {
		ipcRenderer.on('mainprocess-response', (event, arg) => {
            console.log(arg);
			const message = "Test ran successfully. Logs are in my-app folder.";
			document.getElementById("results").innerHTML = message;
        });
		document.getElementById("results").innerHTML = 'Running...';
        ipcRenderer.send('request-run-test', null);
    }
});
