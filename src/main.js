import { app, BrowserWindow, ipcMain } from 'electron/main'
import schedule from 'node-schedule'
import path from 'node:path'
const rule = '1/15 * * * * *' //秒分

const QWetherBaseURL = "https://devapi.qweather.com/v7/weather/now?"
let cityID = "101281009" //湛江
let APIKey = ""
let targetURL = ""
let weatherData = null

function fetchUrl(targetURL) {
    fetch(targetURL, {
        type: 'get',
        dataType: 'json'
    }).then(response => {
        if (response.ok) return response.json()
    }).then(data => {
        //console.log(data, '和风天气，，，，')
        weatherData = data
    })
}

function createWindow() {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(path.dirname(new URL(import.meta.url).pathname), 'preload.js')
        }
    })

    const job = schedule.scheduleJob("weather", rule, () => {
        targetURL = `${QWetherBaseURL}location=${cityID}&key=${APIKey}`

        fetchUrl(targetURL) //此处应加上城市字段
        if (weatherData == null) { //非严格等于 如果 weatherData null 或 undefined 函数直接结束。
            return
        }
        const key = "CityID"
        weatherData[key] = cityID
        mainWindow.webContents.send('update-weather', weatherData)
        console.log(weatherData)

    })

    mainWindow.loadFile('index.html')

    mainWindow.webContents.on('did-finish-load', () => {
        mainWindow.webContents.send('load-complete')
    })

    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    // 监听窗口关闭事件
    mainWindow.on('closed', () => {
        // 取消所有计划的任务
        schedule.gracefulShutdown()
        // 退出应用
        app.quit()
    })
}

app.whenReady().then(createWindow)

//开启监听渲染进程发过来的信息
ipcMain.on('city-id', (_event, value) => {
    cityID = value

    console.log(value)
})

ipcMain.on('api-key', (_event, value) => {
    APIKey = value
    console.log(value)
})
