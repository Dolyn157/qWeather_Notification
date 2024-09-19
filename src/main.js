import { app, BrowserWindow, ipcMain } from 'electron/main'
import { dialog } from 'electron'
import schedule from 'node-schedule'
import path from 'node:path'
import {cityMap} from './utils.js'
import fs from "fs";
import {parse} from "csv-parse";
import {finished} from "stream/promises";

//全局变量
const QWetherBaseURL = "https://devapi.qweather.com/v7/weather/now?"
let cityID = "101281009" //湛江
let cityName = null
let APIKey = ""
let targetURL = ""
let weatherData = null
let periodRule = '1/15 * * * * *' //秒分时日月周
let job1 = "" //定时任务1
//一些静态文件地址
let str = path.join(path.dirname(new URL(import.meta.url).pathname), 'preload.js')
str = str.slice(1)
let csvFile = path.join(path.dirname(new URL('.',import.meta.url).pathname), 'China-City-List-latest.csv')
csvFile = csvFile.slice(1)


//加载城市地图字典

const processFile = async () => {
    let cityM = new Map();
    const parser = fs
        .createReadStream(csvFile, { encoding: 'utf8'})
        .pipe(parse({
            // CSV options if any
            skip_empty_lines:true,
            columns:true,
            trim:true
        }));
    parser.on('readable', function(){
        let record; while ((record = parser.read()) !== null) {
            // Work with each record
            cityM.set(record.Location_Name_ZH,record.Location_ID)
        }
    });
    await finished(parser);
    return cityM;
};
// Get parsed the CSV content
const cityMap1 = await processFile();


//发送 HTTP 请求并返回天气数据
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

//创建主窗口
function createWindow() {

    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: str
        }
    })

        job1 = schedule.scheduleJob("weather", periodRule, () => {
        targetURL = `${QWetherBaseURL}location=${cityID}&key=${APIKey}`

        fetchUrl(targetURL) //此处应加上城市字段
        if (weatherData == null) { //非严格等于 如果 weatherData null 或 undefined 函数直接结束。
            return
        }

        const key1 = "CityID"
        const key2 = "City"
        weatherData[key1] = cityID
        weatherData[key2] = cityName

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
    if (!cityMap1.get(value)){
        dialog.showMessageBox({
            type:'info',
            title: '提示',
            message: '在字典中找不到该城市',
            buttons:['ok']
        },(index) => {
            if ( index == 0 ) {
                console.log('You click ok.');
            }
        })
        }else{
            cityID = cityMap1.get(value)
            cityName = value
        }
    console.log(value)
})

ipcMain.on('api-key', (_event, value) => {
    APIKey = value
    console.log(value)
})

ipcMain.on('selected-period', (_event, value) => {
    switch (value){
        case "seconds":
            periodRule = '1/15 * * * * *' //秒分
            break
        case "minutes":
            periodRule = '0 */1 * * * *'
            break
        case "hours":
            periodRule = '0 0 */1 * * *'
    }
    schedule.rescheduleJob(job1, periodRule)
    console.log(periodRule)
})
