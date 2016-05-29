<template>
	<div class="bg"></div>
	<div class="option">
		<div class="logo"></div>
		<div class="form">
			<input class="user" type="text" @input="changeUserName" :value="info.username" placeholder="username">
			<input class="pass" type="password" @input="changePassWord" :value="info.password" placeholder="password">
            <input type="text" @input="changeProxy" :value="option.proxy" placeholder="代理（选填）">
		</div>
		<a v-link="'setting'" class="btn submit" @click="loginAsync(info)">登陆</a>
	</div>
</template>


<script>
import store from 'app/vuex'
import * as actions from 'app/vuex/actions'

export default {
	store,
	vuex: {
		getters: {
			info: state => state.info,
			option: state => state.option.proxy
		},
		actions
	}
}

</script>
