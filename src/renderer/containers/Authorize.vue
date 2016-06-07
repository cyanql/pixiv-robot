<template>
	<div class="bg-matte"></div>
	<ui-fab type="mini" icon="arrow_back" class="ui-fab" @click="goBack"></ui-fab>
	<webview id="webview" src="https://www.pixiv.net" ></webview>
</template>

<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'

export default {
	store,
	vuex: {
		actions
	},
	ready() {
		const webview = document.getElementById('webview')
		webview.addEventListener('dom-ready', () => {
			const ses = webview.getWebContents().session
			/*ses.setProxy({
				pacScript: 'http://127.0.0.1:16823/proxy_on.pac'
			}, (result) => {
				console.log(`proxy--finish${result}`)
			})*/
			ses.webRequest.onCompleted({
				method: 'POST'
			}, (details, callback) => {
				const cookies = details.responseHeaders['Set-Cookie']
				if (cookies) {
					const cookie = cookies.find(v => /PHPSESSID=\d+_[a-z0-9]+/.test(v))
					if (cookie) {
						this.authorizeLoginAsync(cookie)
						ses.clearStorageData({
							storages: ['cookies']
						}, () => {
							console.log('clear cookies')
						})
					}
				}
			})
		})
	},
	methods: {
		goBack() {
			window.history.back()
		}
	}
}
</script>

<style lang="less">

	.bg-matte {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: -webkit-radial-gradient(circle,#46c463 0%,#2db861 100%);
		background-image:         radial-gradient(circle,#46c463 0%,#2db861 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#46c463', endColorstr='#2db861',GradientType=0 );
	}

	.ui-fab {
		position: absolute;
		top: 0;
		right: 0;
		margin: 10px;
	}

	#webview {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		min-width: 600px;
	}
</style>
