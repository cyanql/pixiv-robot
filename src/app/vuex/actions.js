import * as types from './types'
import * as pixivApi from 'app/pixiv'

export const changeAuthorId = ({dispatch}, e) => {
	dispatch(types.CHANGE_AUTHORID, e.target.value)
}

export const changeDownloadPath = ({dispatch}, e) => {
	dispatch(types.CHANGE_DOWNLOADPATH, e.target.value)
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



export const loginAsync = async ({dispatch}, userinfo) => {
	await pixivApi.loginAsync(userinfo)
    dispatch(types.LOGIN)
}

export const setOption = ({dispatch}, config) => {
	pixivApi.setOption(config)
	dispatch(types.CONFIG)
}

export const searchAsync = async ({dispatch}, authorId) => {
	pixivApi.setOption({authorId: authorId})
	await pixivApi.downloadThumbnails()
	const picList = await pixivApi.getPictrueSrcFromLocal()
	dispatch(types.SEARCH, picList)
}

export const downloadAsync = async ({dispatch}, picList) => {
	await pixivApi.downloadPictures(picList)
	dispatch(types.DOWNLOAD)
}
