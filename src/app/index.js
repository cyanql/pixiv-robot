import Vue from 'vue'
import App from 'app/containers/App'
import Login from 'app/containers/Login'
import Setting from 'app/containers/Setting'
import Search from 'app/containers/Search'
import VueRouter from 'vue-router'


Vue.config.debug = true

Vue.use(VueRouter)

const router = new VueRouter()

router.map({
	'/': {
		name: 'search',
		component: Search
	},
	'/login': {
		name: 'login',
		component: Login
	},
	'/setting': {
		name: 'setting',
		component: Setting
	}
})


router.beforeEach(({to, next, redirect}) => {
	global.to = to
	//除login页外，处于未登录状态时跳转login页
	if (to.name !== 'login' && !to.auth) {
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
