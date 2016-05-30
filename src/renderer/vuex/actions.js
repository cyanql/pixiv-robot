import * as types from './types'
import { ipcRenderer } from 'electron'

export const changeAuthorId = ({dispatch}, e) => {
	dispatch(types.CHANGE_AUTHORID, e.target.value)
}

export const changeDownloadPath = ({dispatch}, value) => {
	dispatch(types.CHANGE_DOWNLOADPATH, value)
}

export const changeTimeout = ({dispatch}, e) => {
	dispatch(types.CHANGE_TIMEOUT, e.target.value)
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
	const exists = ipcRenderer.send('existsCookie')
	dispatch(types.CHECK_COOKIE, exists)
}

export const login = ({dispatch}, cookie) => {
	ipcRenderer.send('setOption', {
		'cookie': cookie
	})
	//返回登录结果
    dispatch(types.LOGIN, true)
}

export const setOption = ({dispatch}, option) => {
	ipcRenderer.send('setOption', option)
	dispatch(types.SET_OPTION)
}

export const searchAsync = async ({dispatch}, authorId, refresh) => {
	let picList = await ipcRenderer.send('getPicListFromCacheAsync', authorId)
	//当本地缓存不存在或强制刷新时
	if (!picList.length || refresh) {
		picList = ipcRenderer.send('downloadThumbListAsync', authorId)
	console.log(picList, authorId)
		picList.forEach((v, i) => {
			v.onProgress = (per) => progress(i, per)
			v.onFinished = async () => {
				const pic = await ipcRenderer.send('getPictrueFromCacheAsync', authorId, v.name)
				dispatch(types.SEARCH, picList)
				finished(i, pic)
			}
			v.onNotFound = () => notFound(i)
		})
	}
}

export const downloadPicListAsync = async ({dispatch}, authorId, picList) => {
	picList = await ipcRenderer.send('downloadPicListAsync', authorId, picList)
	picList.forEach((v, i) => {
		v.onProgress = (per) => progress(i, per)
		v.onFinished = () => finished(i)
		v.onNotFound = () => notFound(i)
	})
	dispatch(types.DOWNLOAD)
}

export const progress = () => {

}

export const finished = () => {

}

export const notFound = () => {

}
