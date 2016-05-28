<template>
	<div class="search clear-fix">
		<div class="btn-group clear-fix">
			<a class="btn" @click="searchAsync">查找</a>
			<a class="btn" @click="downloadAsync">下载</a>
		</div>
		<div class="content clear-fix">
			<label>作者ID</label>
			<input
				@input="changeAuthorId"
				:value="authorId"
			>
		</div>
	</div>
	<div v-for="picItem in picList" class="container">
		<div class="item" style="{width: picItem.width * 200 / picItem.height + 'px', flexGrow: picItem.width * 200 / picItem.height}">
			<i style="{paddingBottom: picItem.height / picItem.width * 100 + '%'}"></i>
			<img :src="picItem.src" :alt="picItem.id">
		</div>
	</div>
</template>

<script>
import store from 'app/vuex'
import * as actions from 'app/vuex/actions'

export default {
	store,
	vuex: {
		getters: {
			authorId: state => state.authorId,
			picList: state => state.picList
		},
		actions
	}
}
</script>

<style scoped lang="less">
@import "~app/variables";

@label-width: 100px;

.search {
	background-color: @main-color;

	& > .content {
		float: right;
		width: 300px;
		padding-left: @label-width;

		& > label,
		& > input {
			float: left;
			line-height: @input-height;
			color: white;
		}

		& > label {
			width: @label-width;
			margin-left: -@label-width;
			text-align: center;
		}

		& > input {
			background-color: darken(@main-color, 2%);
			width: 100%;
			text-indent: 10px;
			font-size: 16px;
		}
	}

	& > .btn-group {
		float: right;
		font-size: 0;

		& > .btn {
			float: left;
			width: @label-width;
			height: @input-height;
			color: white;

			&:active {
				background-color: darken(@main-color, 2%);
			}
		}
	}
}
.container {
    display: flex;
    flex-wrap: wrap;

	&:after {
	    content: '';
	    flex-grow: 999999999;
	}

	& > .item {
	    margin: 2px;
	    background-color: violet;
	    position: relative;

		& > i {
		    display: block;
		}
		& > img {
		    position: absolute;
		    top: 0;
		    width: 100%;
		    vertical-align: bottom;
		}
	}
}
</style>
