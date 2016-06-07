import Vue from 'vue'
import App from 'renderer/containers/App'
import VueRouter from 'vue-router'
import 'material-design-icons'
import 'keen-ui/dist/keen-ui.css'
import KeenUI from 'keen-ui'

Vue.config.debug = true

Vue.use(VueRouter)
Vue.use(KeenUI)

const router = new VueRouter()

router.map({
	'/': {
		name: 'search',
		component(resolve) {
			require(['renderer/containers/Search'], resolve)
		},
		validation: true
	},
	'/authorize': {
		name: 'authorize',
		component(resolve) {
			require(['renderer/containers/Authorize'], resolve)
		}
	},
	'/login': {
		name: 'login',
		component(resolve) {
			require(['renderer/containers/Login'], resolve)
		}
	},
	'/setting': {
		name: 'setting',
		component(resolve) {
			require(['renderer/containers/Setting'], resolve)
		}
	}
})

router.beforeEach(({to, next, redirect}) => {
	if (to.validation) {
		to.router.app.addSnack({
			message: '登录验证'
		})
		return Promise.resolve(to.router.app.logined)
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
