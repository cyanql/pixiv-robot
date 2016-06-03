import * as types from './types'
import { remote } from 'electron'

const state = {
	logined: false,
	loading: false,
	info: {
		username: 'pixivrobot@gmail.com',
		password: 'pixiv123456',
		proxy: 'http://127.0.0.1:8787',
		downloadPath: remote.app.getPath('pictures')
	},
	authorId: '45438&type=all&p=2',
	picList: [
		/*{
		src: '',
		localSrc: '',
		name: '',
		width: '',
		height: '',
		type: '',
		selected: false,
		progress: 0
	}*/]
}

const mutations = {
	[types.CHECK_COOKIE] (state, exists){
		state.logined = exists
	},
	[types.LOGIN] (state, logined) {
		state.logined = logined
	},
	[types.SEARCH] (state, picList) {
		state.picList = state.picList.concat(picList)
	},
	[types.SET_OPTION] (state) {

	},
	[types.LOADING_START] (state) {
		state.loading = true
	},
	[types.LOADING_END] (state) {
		state.loading = false
	},
	[types.DOWNLOAD_PROGREE] (state, index, progress) {
		state.picList[index].progress = progress
	},
	[types.CHANGE_PICITEM_STYLE] (state, width, height, index) {
		state.picList[index].width = width
		state.picList[index].height = height
	},
	[types.SELECT_PICITEM] (state, index) {
		state.picList[index].selected = !state.picList[index].selected
	},
	[types.DOWNLOAD] (state) {

	},
	[types.CHANGE_AUTHORID] (state, value) {
		// if (!/^\d+$/.test(value))
		// 	return
		state.authorId = value
	},
	[types.CHANGE_DOWNLOADPATH] (state, value) {
		state.info.downloadPath = value
	},
	[types.CHANGE_TIMEOUT] (state, value) {
		state.info.timeout = value
	},
	[types.CHANGE_PROXY] (state, value) {
		state.info.proxy = value
	},
	[types.CHANGE_USER_NAME] (state, value) {
		state.info.username = value
	},
	[types.CHANGE_PASS_WORD] (state, value) {
		state.info.password = value
	}
}

export default {
	state,
	mutations
}
