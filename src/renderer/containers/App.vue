<template>
	<ui-toolbar type="default" text-color="black" :title="title" :loading="loading" hide-nav-icon show-brand>
		<div slot="actions">
			<ui-icon-button type="clear" color="black" icon="search" @click="switchPage('search')" :disabled="!logined"></ui-icon-button>
			<ui-icon-button type="clear" color="black" icon="account_circle" :menu-options="menu" @menu-option-selected="menuOptionSelected" dropdown-position="bottom right" has-dropdown-menu show-menu-icons></ui-icon-button>
			<ui-icon-button type="clear" color="black" icon="settings" @click="switchPage('setting')"></ui-icon-button>
		</div>
	</ui-toolbar>
	<router-view></router-view>
</template>

<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'

export default {
	store,
	vuex: {
		getters: {
			logined: state => state.logined,
			loading: state => state.loading,
			snack: state => state.snack
		},
		actions
	},
	computed: {
		menu() {
			console.log(this.logined)
			return [{
				route: 'login',
				icon: 'compare_arrows',
				id: 'switch_account',
				text: '切换账号'
			}, {
				route: 'authorize',
				icon: 'http',
				id: 'authorize',
				text: '网页登录',
				disabled: this.logined
			}, {
				route: 'clear_cache',
				icon: 'delete',
				id: '',
				text: '清除缓存',
				disabled: true
			}, {
				route: 'login',
				icon: 'exit_to_app',
				id: 'logout',
				text: '注销账号'
			}]
		},
		title() {
			return this.$route.name.replace(/^\w/, (val) => val.toUpperCase())
		}
	},
	created() {
		this.getUserInfo()
		this.$watch('logined', (val) => {
			if (val) {
				this.$router.go('search')
			} else {
				this.$router.go('login')
			}
		})
		this.$watch('snack', (snack) => {
			console.log(snack)
			this.$broadcast('ui-snackbar::create', snack)
		})
	},
	methods: {
		menuOptionSelected(result) {
			switch (result.id) {
				case 'logout':
					this.logoutAsync()
					break
				case 'clear_cache':
					const ctx = require('remote').getCurrentWindow().webContents
					ctx.session.clearCache((err) => { console.log(err) })
					break
				default:
					break
			}
			this.$router.go(result.route)
		},
		switchPage(target) {
			this.$router.go(target)
		}
	}
}

</script>


<style lang="less">
@import "~renderer/variables.less";

body,select,dd,dl,dt,li,ol,ul,span,div,form,h1,h2,h3,h4,h5,h6,hr,p,a,button,input,textarea {
	font: 14px/1.5 'Microsoft YaHei','\\5FAE\8F6F\96C5\9ED1','arial','simsun';
	border: none;
	outline: none;
	margin: 0;
	padding: 0;
}
body {
	min-width: 600px;
	background-image: -webkit-radial-gradient(circle,#46c463 0%,#2db861 100%);
	background-image:         radial-gradient(circle,#46c463 0%,#2db861 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#46c463', endColorstr='#2db861',GradientType=0 );
}
li {list-style: none;}

a {text-decoration: none;}

*,
*:after,
*:before {
	box-sizing: border-box;
}
input[type="file"] {
	-webkit-appearance: none;
}

.option {
	width: @width;
	margin: 100px auto 0 auto;

	& > .logo {
		height: @logo-height;
		margin: 0 auto;
		background: @img-logo center no-repeat;
	}

	& > .form > input {
		width: 100%;
		height: @input-height;
		text-indent: 50px;
		color: @font-normal-color;
	}

	& .user {
		background: white @img-user 20px center no-repeat;
	}

	& .pass {
		background: white @img-user 20px center no-repeat;
	}
}

.btn {
	display: inline-block;
	height: @input-height;
	line-height: @input-height;
	text-align: center;

	&.submit {
		width: 100%;
		background-color: darken(@main-color, 2%);
		color: @btn-color;

		&:hover {
			background-color: lighten(@main-color, 10%)
		}

		&:active {
			transform: translate(0, 2px);
		}
	}
}

.clear-fix {
	overflow: hidden;

	&:after {
		content: '';
		clear: both;
		font-size: 0;
		visibility: hidden;
	}
}


.loading {
	display: block;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	margin: 0 auto;
	margin-top: 200px;
	transition: opacity 1s ease;
	opacity: 0;
}

.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}

/* fallback */
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: local('Material Icons'),
		  local('MaterialIcons-Regular'),
		url('https://fonts.gstatic.com/s/materialicons/v16/2fcrYFNaTjcS6g4U3t-Y5UEw0lE80llgEseQY3FEmqw.woff2') format('woff2');
}

</style>
