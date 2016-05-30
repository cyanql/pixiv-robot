<template>
	<div class="bg"></div>
    <form method="post" class="option">
        <div class="logo"></div>
        <div class="form">
            <div class="form-item clear-fix">
				<span>下载路径</span>
				<span>{{info.downloadPath || '无'}}</span>
				<span @click="changeDownloadPath(info.downloadPath)">...</span>
			</div>
        </div>
		<a v-link="'search'" class="btn submit" @click="setOption(option)">设置</a>
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
		actions: {
			changeDownloadPath: actions.changeDownloadPath,
			setOption: actions.setOption
		}
	}
}
</script>

<style lang="less" scoped>
@import "~renderer/variables";


.form {
	&-item {
		background-color: white;

		& > span {
			line-height: @input-height;
			color: @font-normal-color;
			display: block;
			float: left;
		}

		& > span:nth-child(1) {
			width: 20%;
			text-align: center;
		}

		& > span:nth-child(2) {
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			border-left: 1px solid lighten(@shadow-color, 50%);
			border-right: 1px solid lighten(@shadow-color, 50%);
			text-indent: 10px;
			width: 70%;
			text-align: left;
		}

		& > span:nth-child(3) {
			width: 10%;
			text-align: center;

			&:active {
				background-color: lighten(@shadow-color, 50%);
			}
		}
	}
}

</style>
