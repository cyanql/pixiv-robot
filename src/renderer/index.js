import Vue from 'vue'
import App from 'renderer/containers/App'
import VueRouter from 'vue-router'

Vue.config.debug = true

Vue.use(VueRouter)

const router = new VueRouter()

router.map({
	'/': {
		name: 'search',
		component: require('renderer/containers/Search')
	},
	'/login': {
		name: 'login',
		component: require('renderer/containers/Login')
	},
	'/setting': {
		name: 'setting',
		component: require('renderer/containers/Setting')
	}
})

router.beforeEach(({to, next, redirect}) => {
	//除login外，处于未登录状态时跳login
	if (to.name !== 'login' && !router.app.logined) {
		redirect('login')
	} else {
		next()
	}
})

router.redirect({
	'*': '/'
})

const div = document.createElement('div')
div.id = 'root'
document.body.appendChild(div)

router.start(App, '#root')

if (module.hot) {
	module.hot.accept()
}

export default {
	router
}
