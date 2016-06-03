<template>
	<div class="bg"></div>
	<div class="option">
		<div class="logo"></div>
		<div class="form">
			<input class="user" type="text" @input="changeUserName" :value="info.username" placeholder="username">
			<input class="pass" type="password" @input="changePassWord" :value="info.password" placeholder="password">
			<input type="text" @input="changeProxy" :value="info.proxy" placeholder="代理（选填）">
		</div>
		<a  class="btn submit" @click="loginAsync(info)">登陆</a>
	</div>
	<ripple></ripple>
	<!-- <webview id="webview" src="https://www.pixiv.net" ></webview> -->
</template>


<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'
import Svg from 'renderer/components/Svg'
//迷之不支持解构
const Ripple = Svg.Ripple

export default {
	store,
	vuex: {
		getters: {
			info: state => state.info,
			logined: state => state.logined
		},
		actions
	},
	route: {

	},
	compiled() {
		this.$watch('logined', () => {
			this.logined && this.$router.go('setting')
		})
	},
	ready() {
		// const webview = document.getElementById('webview')
		// webview.addEventListener('dom-ready', () => {
		// 	const ctx = webview.getWebContents()
		// 	/*ctx.session.setProxy({
		// 		pacScript: 'http://127.0.0.1:16823/proxy_on.pac'
		// 	}, (result) => {
		// 		console.log(`proxy--finish${result}`)
		// 	})*/
		// 	ctx.session.cookies.get({url: 'https://www.pixiv.net', name: 'PHPSESSID'}, (err, cookies) => {
		// 	    if (err) throw err;
		// 		const result = cookies.find(v => /^\d+_[a-z0-9]/.test(v.value))
		// 		const cookie = result && result.name + '=' + result.value
		// 		cookie && !this.login(cookie) && this.$router.go('search')
		// 	})
		// })
	}
}
</script>

<style lang="less">
	#webview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-width: 600px;
	}
</style>
