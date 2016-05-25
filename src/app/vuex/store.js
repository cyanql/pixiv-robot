import * as types from './types'

const state = {
    info: {
        username: '',
        password: ''
    },
    option: {
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
    [types.LOGIN] (state) {

    },
	[types.SEARCH] (state) {

	},
	[types.CONFIG] (state) {

	},
	[types.DOWNLOAD] (state) {

	},
	[types.CHANGE_AUTHORID] (state, value) {
		if (!/^\d+$/.test(value))
			return
		state.authorId = value
	},
	[types.CHANGE_DOWNLOADPATH] (state, value) {
		state.option.downloadPath = value
	},
	[types.CHANGE_TIMEOUT] (state, value) {
		state.option.timeout = value
	},
	[types.CHANGE_PROXY] (state, value) {
		state.option.proxy = value
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
