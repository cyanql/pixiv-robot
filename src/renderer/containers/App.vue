<template>
	<router-view></router-view>
</template>

<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'

export default {
	store,
	vuex: {
		getters: {
			logined: state => state.logined
	    },
		actions
	},
	beforeCompile() {
		console.log(this.logined)
		this.checkCookie()
		//不存在cookie缓存则跳转login
		if(!this.logined)
			this.$router.go('login')
	},
	route: {
		activate(transition) {
			console.log('activate___________________')
			transition.next()
		}
	}
}

</script>


<style lang="less">
@import "~renderer/variables.less";

body,select,dd,dl,dt,li,ol,ul,span,div,form,h1,h2,h3,h4,h5,h6,hr,p,a,button,input,textarea {
	font: 14px/1.5 'Microsoft YaHei','\\5FAE\8F6F\96C5\9ED1','arial','simsun';
	color: @font-normal-color;
	border: none;
	outline: none;
	margin: 0;
	padding: 0;
}
body {
	min-width: 600px;
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
    position: absolute;
    top: 15%;
	left: 0;
	right: 0;
    width: @width;
	margin: 0 auto;

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

.bg {
	position: absolute;
	z-index: -1;
	width: 100%;
	height: 100%;
	background-image: -webkit-radial-gradient(circle,#46c463 0%,#2db861 100%);
	background-image:         radial-gradient(circle,#46c463 0%,#2db861 100%);filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#46c463', endColorstr='#2db861',GradientType=0 );
}
</style>
