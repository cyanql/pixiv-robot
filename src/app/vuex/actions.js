import * as types from './types'
import * as pixivApi from 'app/pixiv'
import electron from 'electron'

global.electron = electron
export const changeAuthorId = ({dispatch}, e) => {
	dispatch(types.CHANGE_AUTHORID, e.target.value)
}

export const changeDownloadPath = ({dispatch}, preDownloadPath) => {
	console.log(preDownloadPath)
	//通过remote调用主进程的dialog组件 返回类型Array
	const downloadPath = electron.remote.dialog.showOpenDialog({
		defaultPath: preDownloadPath,
		properties: [ 'openDirectory', 'createDirectory' ]
	})
	//若选取了路径则修改，否则不变
	downloadPath && dispatch(types.CHANGE_DOWNLOADPATH, downloadPath.toString())
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



export const login = async ({dispatch}, userinfo) => {

	// await pixivApi.login(userinfo)
    dispatch(types.LOGIN)
}

//神特么config,option居然和vuex内部命名冲突
export const setOption = async ({dispatch}, option) => {
	pixivApi.setOption(option)
	dispatch(types.CONFIG)
}

export const search = async ({dispatch}, authorId) => {
	pixivApi.setOption({authorId: authorId})
	await pixivApi.downloadThumbnails()
	const picList = await pixivApi.getPictrueSrcFromLocal()
	dispatch(types.SEARCH, authorId)
}

export const download = async ({dispatch}, picList) => {
	await pixivApi.downloadPictures(picList)
	dispatch(types.DOWNLOAD)
}
