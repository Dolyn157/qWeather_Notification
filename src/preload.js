
const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateWeather: (callback) => ipcRenderer.on('update-weather', (_event, value) => callback(value)),
    onLoadComplete: (callback) => ipcRenderer.on('load-complete', (_event, value1) => callback(value1)),

})

contextBridge.exposeInMainWorld('UserSettings', {
    city_id: (value) => ipcRenderer.send('city-id', value),
    api_key: (value) => ipcRenderer.send('api-key', value),
    selected_period: (value) => ipcRenderer.send('selected-period', value)
})
