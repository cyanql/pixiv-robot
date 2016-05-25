<template>
	<div class="bg"></div>
	<div class="option">
		<div class="logo"></div>
		<div class="form">
			<input class="user" @input="changeUserName" :value="info.username" placeholder="username">
			<input class="pass" type="password" @input="changePassWord" :value="info.password" placeholder="password">
            <input @input="changeProxy" :value="option.proxy" placeholder="代理（选填，仅支持http/https）">
		</div>
		<a v-link="'option'" class="btn submit" @click="login">登陆</a>
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
			option: state => state.option
		},
		actions
	}
}

</script>
