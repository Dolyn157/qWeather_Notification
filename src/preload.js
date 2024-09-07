import { contextBridge, ipcRenderer } from 'electron/renderer'

contextBridge.exposeInMainWorld('electronAPI', {
    onUpdateWeather: (callback) => ipcRenderer.on('update-weather', (_event, value) => callback(value)),
    onLoadComplete: (callback) => ipcRenderer.on('load-complete', (_event, value1) => callback(value1)),
    city_id: (value) => ipcRenderer.send('city-id', value),
    api_key: (value) => ipcRenderer.send('api-key', value)
})