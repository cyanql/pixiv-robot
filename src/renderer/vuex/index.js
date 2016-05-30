import Vue  from 'vue'
import Vuex from 'vuex'
import Store from './store'

Vue.use(Vuex)


const store = new Vuex.Store(Store)

if (module.hot) {
	module.hot.accept(['./actions', './store', './types'], () => {
		const newActions = require('./actions').default
		const newMutations = require('./store').default
		store.hotUpdate({
			actions: newActions,
			mutations: newMutations
		})
	})
}

export default store
