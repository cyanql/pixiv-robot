import { app, BrowserWindow } from 'electron'
import path from 'path'
import './ipc'

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
let mainWindow = null


app.on('window-all-closed', () => {
	if (process.platform != 'darwin') {
		app.quit()
	}
})


app.on('ready', () => {
	// 创建浏览器窗口。
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		movable: true,
		title: 'PixivRobot',
		titleBarStyle: 'hidden-inset',
		webPreferences: {
			webSecurity: false
		}
	})


	if (process.env.NODE_ENV === 'development') {
		mainWindow.loadURL('http://localhost:3000/build/renderer/index.html')
		// 打开开发工具
		mainWindow.openDevTools()
	} else {
		mainWindow.loadURL(`file://${path.dirname(app.getAppPath())}/app/renderer/index.html`)
	}

	mainWindow.webContents.session.webRequest.onBeforeSendHeaders({
		method: 'GET',
		resourceType: 'image'
	}, (details, callback) => {
		details.requestHeaders.referer = 'https://www.pixiv.net'
		callback({
			cancel: false,
			requestHeaders: details.requestHeaders
		})
	})


	mainWindow.on('closed', () => {
		mainWindow = null
	})
})
