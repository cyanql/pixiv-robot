<template>
	<form class="option">
		<div class="logo"></div>
		<div class="form">
			<ui-textbox name="user" icon="file_download" type="text" label="下载路径" @click="changeDownloadPath(info.downloadPath)" :value="info.downloadPath" :validation-messages="{required: '请选择下载路径'}" validation-rules="required"></ui-textbox>
			<ui-textbox name="user" icon="language" type="text" label="代理（选填）" @input="changeProxy" :value="info.proxy"  placeholder="http://127.0.0.1:8787" :validation-messages="{url: '请输入符合url格式的内容'}" validation-rules="url"></ui-textbox>
			<ui-button class="submit" v-link="'search'" @click="setOption(info)">设置</ui-button>
		</div>
	</form>
</template>


<script>
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'

export default {
	store,
	vuex: {
		getters: {
			info: state => state.info
		},
		actions
	}
}
</script>
