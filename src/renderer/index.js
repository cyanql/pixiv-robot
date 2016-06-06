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
	next()
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
