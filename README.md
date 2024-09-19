# qWeather_Notification
一个用 Electron+node-schedule 实现的天气信息通知桌面应用
## 实现功能

- [x] 定时返回和风天气API的内容并发送通知
- [x] 用户指定需要的城市
- [x] 从 localstorage 或其他持久化方案中加载用户自己的和风天气 APIKey
- [x] 用户自定通知发送间隔
- [x] 增加了城市中文名称和 ID 编号之间相关联的字典
- [x] 打包发布

## 安装方法

目前，本项目还未打包所以先讲如何在开发环境中运行。
拉去本仓库后用你的 Node.js 软件包管理器安装好依赖，然后运行
> pnpm run start

## 使用方法
在主界面城市一栏填写和风天气城市代码，可以从这个[链接](https://github.com/qwd/LocationList)里获得。默认城市为湛江霞山区 101281009。
然后在 APIKEY 一栏填上自己的和风天气 APIKEY ，即可定时收到通知。
