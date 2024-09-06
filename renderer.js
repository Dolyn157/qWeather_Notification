

window.electronAPI.onUpdateWeather((value) => {

    const Noti_Title = '和风天气提醒您天气：\n'

    const obsTime = value.now.obsTime
    const temp = value.now.temp
    const text = value.now.text

    new window.Notification(Noti_Title, { body: `"采样时间": ${obsTime}, "\n温度℃": ${temp}, "\n天气状况": ${text}`})
})

window.electronAPI.onLoadComplete((value) => {
    const apiKey= localStorage.getItem('apiKey')
    window.electronAPI.api_key(apiKey)
})

document.getElementById('submit1').onclick = () =>{
    let text = document.getElementById('city').value
    window.electronAPI.city_id(text)

    alert("按钮点击" + text)
}

document.getElementById('submit2').onclick = () =>{
    let apiKeySubmit = document.getElementById('apikey').value
    localStorage.setItem('apiKey', apiKeySubmit)
    window.electronAPI.api_key(apiKeySubmit)
    alert("按钮点击" + text)
}