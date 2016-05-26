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



export const login = async ({dispatch}, userinfo) => {
	await pixivApi.login(userinfo)
    dispatch(types.LOGIN)
}

export const setOption = async ({dispatch}, config) => {
	pixivApi.setOption(config)
	dispatch(types.CONFIG)
}

export const search = async ({dispatch}, authorId) => {
	pixivApi.setOption({authorId: authorId})
	await pixivApi.downloadThumbnails()
	const picList = await pixivApi.getPictrueSrcFromLocal()
	dispatch(types.SEARCH, picList)
}

export const download = async ({dispatch}, picList) => {
	await pixivApi.downloadPictures(picList)
	dispatch(types.DOWNLOAD)
}
