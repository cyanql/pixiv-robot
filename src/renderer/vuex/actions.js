import * as types from './types'
import store from './index'
import { remote, ipcRenderer } from 'electron'

export const changeAuthorId = ({dispatch}, e) => {
	dispatch(types.CHANGE_AUTHORID, e.target.value)
}

export const changePicItemStyle = ({dispatch}, e, index) => {
	dispatch(types.CHANGE_PICITEM_STYLE, e.path[0].naturalWidth, e.path[0].naturalHeight, index)
}

export const changeDownloadPath = ({dispatch}, preDownloadPath) => {
	const downloadPath = remote.dialog.showOpenDialog({
		defaultPath: preDownloadPath,
		properties: [ 'openDirectory', 'createDirectory' ]
	})
	//若选取了路径则修改，否则不变
	downloadPath && dispatch(types.CHANGE_DOWNLOADPATH, downloadPath.toString())
}

export const selectPicItem = ({dispatch}, index) => {
	dispatch(types.SELECT_PICITEM, index)
}

export const changeProxy = ({dispatch}, e) => {
	dispatch(types.CHANGE_PROXY, e.target.value)
}

export const changeUserName = ({dispatch}, e) => {
	dispatch(types.CHANGE_USER_NAME, e.target.value)
}

export const changePassWord = ({dispatch}, e) => {
	dispatch(types.CHANGE_PASS_WORD, e.target.value)
}

export const checkCookie = ({dispatch}) => {
	ipcRenderer.send('checkCookie-m')
	ipcRenderer.once('checkCookie-r', (e, exists) => {
		dispatch(types.CHECK_COOKIE, exists)
	})
}
export const loginAsync = ({dispatch}, userinfo) => {
	//必须解构，否则主线程接收到空对象
	ipcRenderer.send('login-m', {
		...userinfo
	})
	ipcRenderer.once('login-r', (e, logined) => {
		dispatch(types.LOGIN, logined)
	})
}
export const login = ({dispatch}, cookie) => {
	ipcRenderer.send('setOption-m', {cookie})
	dispatch(types.LOGIN, true)
}

export const setOption = ({dispatch}, option) => {
	ipcRenderer.send('setOption-m', {
		...option
	})
	dispatch(types.SET_OPTION)
}

export const searchAsync = ({dispatch}, authorId, refresh) => {
	console.log(authorId)//45438&type=all&p=2

	dispatch(types.LOADING_START)
	//获取缓存图片列表
	ipcRenderer.send('getThumbListFromCache-m', authorId)
	ipcRenderer.once('getThumbListFromCache-r', (e, picList) => {
		//当本地缓存不存在或强制刷新时
		if (!picList.length || refresh) {
			//查找缩略图
			ipcRenderer.send('getThumbListFromNet-m', authorId)
			ipcRenderer.once('getThumbListFromNet-r', (e, picList) => {
				thumbListFactory(picList)
			})
		} else {
			thumbListFactory(picList)
		}
	})
}

export const downloadPicListAsync = ({dispatch}, authorId, picList) => {
	//发送前写入编号
	const newPicList = picList.map((v, i) => {
		v.index = i
		return v
	}).filter(v => v.selected)
	ipcRenderer.send('downloadPicList-m', authorId, JSON.parse(JSON.stringify(newPicList)))
}

//缩略图加工厂，添加必要的属性
function thumbListFactory(picList) {
	picList.forEach(v => {
		v.selected = false
		v.width = 0
		v.height = 0
		v.progress = 0
	})
	store.dispatch(types.LOADING_END)
	store.dispatch(types.SEARCH, picList)
}

ipcRenderer.on('download-progress-r', (e, pic, progress) => {
	//获取带有编号的图片
	store.dispatch(types.DOWNLOAD_PROGREE, pic.index, progress)
})

ipcRenderer.on('download-finished-r', (e, pic) => {
	console.log('finished----', pic.name)
	if (pic.name.includes('master'))
		store.dispatch(types.SEARCH, pic)
})

ipcRenderer.on('login-timeout', () => {
	console.log('cookie过期')
	store.dispatch(types.LOGIN_TIMEOUT)
	store.dispatch(types.LOADING_END)
})
