import * as types from './types'
import * as api from 'app/models'

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
	const exists = api.existsCookie()
	dispatch(types.CHECK_COOKIE, exists)
}

export const loginAsync = async ({dispatch}, userinfo) => {
	console.log('begin')
	const logined = await api.loginAsync(userinfo)
	console.log('end', logined)
    dispatch(types.LOGIN, logined)
}

export const setOption = ({dispatch}, option) => {
	api.setOption(option)
	dispatch(types.CONFIG)
}

export const searchAsync = async ({dispatch}, authorId, refresh) => {
	let picList = await api.getPicListFromCacheAsync()
	if (!picList.length || refresh) {
		picList = api.downloadThumbListAsync(authorId)
		picList.forEach((v, i) => {
			v.onProgress = (per) => progress(i, per)
			v.onFinished = async () => {
				const pic = await api.getPictrueFromCacheAsync()
				finished(i, pic)
			}
			v.onNotFound = () => notFound(i)
		})
	}
	dispatch(types.SEARCH, picList)
}

export const downloadPicListAsync = async ({dispatch}, authorId, picList) => {
	picList = await api.downloadPicListAsync(authorId, picList)
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
