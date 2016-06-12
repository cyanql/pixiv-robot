<template>
	<div class="option">
		<logo class="logo" color="#2c6"></logo>
		<div class="form">
			<ui-textbox name="user" icon="person" type="text" label="邮箱(pixiv账号)" @input="changeUserName" :value="info.username" :validation-messages="{required: '请输入内容', email: '请输入符合邮箱格式的内容'}" validation-rules="required|email"></ui-textbox>
			<ui-textbox name="user" icon="lock" type="password" label="密码" @input="changePassWord" :value="info.password" :validation-messages="{required: '请输入内容'}" validation-rules="required"></ui-textbox>
			<ui-button class="submit" @click="loginAsync(info)">登录</ui-button>
		</div>
	</div>
</template>


<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'
import Svg from 'renderer/components/Svg'
//迷之不支持解构
const Logo = Svg.Logo

export default {
	store,
	vuex: {
		getters: {
			info: state => state.info,
			logined: state => state.logined
		},
		actions
	},
	components: {
		Logo
	}
	/*
	route: {
		activate: function (transition) {
			console.log('hook-example activated!')
			transition.next()
		}
	}
	*/
}
</script>
<style lang="less">
.logo {
	margin:30px 20px;
}
</style>
