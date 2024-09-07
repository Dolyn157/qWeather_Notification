
// 相应主进程发送过来的指令
window.electronAPI.onUpdateWeather((value) => {
    const Noti_Title = '和风天气提醒您：\n'

    const cityID = value.CityID
    const obsTime = value.now.obsTime
    const temp = value.now.temp
    const text = value.now.text
    const windDir = value.now.windDir
    const windScale = value.now.windScale

    new window.Notification(Noti_Title, { body: `\n地区：${cityID}, \n"采样时间": ${obsTime}, "\n温度℃": ${temp}, "\n天气状况": ${text}, "\n风向":${windDir}, "\n风力等级":${windScale}`})
})

window.electronAPI.onLoadComplete((value) => {
    const apiKey= localStorage.getItem('apiKey')
    window.UserSettings.api_key(apiKey)
})


//主界面DOM 事件监听
document.getElementById('submit1').onclick = () =>{
    let text = document.getElementById('city').value
    window.UserSettings.city_id(text)

}

document.getElementById('submit2').onclick = () =>{
    let apiKeySubmit = document.getElementById('apikey').value
    localStorage.setItem('apiKey', apiKeySubmit)
    window.UserSettings.api_key(apiKeySubmit)
}

//监听选择列表事件
const periodSelection = document.getElementById('period1')

periodSelection.addEventListener('click', (event) => {
    const selectedPeriod = event.target.value
    window.UserSettings.selected_period(selectedPeriod)
    console.log(`你选择的是： ${selectedPeriod}`)
})