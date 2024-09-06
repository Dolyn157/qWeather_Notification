const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateWeather: (callback) => ipcRenderer.on('update-weather', (_event, value) => callback(value)),
    city_id: (value) => ipcRenderer.send('city-id', value),
    api_key: (value) => ipcRenderer.send('api-key', value)
})