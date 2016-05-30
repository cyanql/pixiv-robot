import * as types from './types'


const state = {
	logined: false,
    info: {
        username: 'pixivrobot@gmail.com',
        password: 'pixiv123456',
		proxy: 'http://127.0.0.1:8787',
        downloadPath: ''
	},
    authorId: '',
    imagelist: [{
		src: '',
		id: ''
	}]
}

const mutations = {
	[types.CHECK_COOKIE] (state, exists){
		state.logined = exists
	},
    [types.LOGIN] (state, logined) {
		state.logined = logined
    },
	[types.SEARCH] (state) {

	},
	[types.SET_OPTION] (state) {

	},
	[types.DOWNLOAD] (state) {

	},
	[types.CHANGE_AUTHORID] (state, value) {
		if (!/^\d+$/.test(value))
			return
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
