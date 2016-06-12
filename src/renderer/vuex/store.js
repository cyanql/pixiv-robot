import * as types from './types'
import { remote } from 'electron'

const state = {
	logined: true,
	loading: false,
	snack: {
		message: '',
		action: '',
		actionColor: '',
		duration: 2000
	},
	info: {
		username: 'pixivrobot@gmail.com',
		password: 'pixiv123456',
		proxy: 'http://127.0.0.1:8787',
		downloadPath: ''
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
	}*/
	]
}

const baseMutations = {
	[types.GET_USER_INFO] (state, userinfo){
		if (!userinfo.cookie)
			state.logined = false
		state.info = Object.assign({}, state.info, userinfo)
	},
	[types.LOGIN] (state, logined) {
		state.logined = logined
	},
	[types.LOGOUT] (state) {
		state.logined = false
	},
	[types.LOGIN_TIMEOUT] (state) {
		state.logined = false
	},
	[types.SEARCH_PICTURE] (state, picture) {
		state.picList = state.picList.push(picture)
	},
	[types.SEARCH_PICLIST] (state, picList) {
		state.picList = picList
	},
	[types.DOWNLOAD] (state) {

	},
	[types.SET_OPTION] (state) {

	},
	[types.ADD_SNACK] (state, option) {
		//option为新添加，可以不解构也能触发响应
		state.snack = Object.assign({}, state.snack, option)
	}
}

const statusMutations = {
	[types.CHANGE_PICITEM_PROGREE] (state, index, progress) {
		state.picList[index].progress = progress
	},
	[types.SELECT_PICITEM] (state, index) {
		state.picList[index].selected = !state.picList[index].selected
	},
	[types.LOADING_START] (state) {
		state.loading = true
	},
	[types.LOADING_END] (state) {
		state.loading = false
	}
}


const inputMutations = {
	[types.CHANGE_AUTHORID] (state, value) {
		// if (!/^\d+$/.test(value))
		// 	return
		state.authorId = value
	},
	[types.CHANGE_DOWNLOADPATH] (state, value) {
		state.info.downloadPath = value
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
	mutations: {
		...baseMutations,
		...statusMutations,
		...inputMutations
	}
}
