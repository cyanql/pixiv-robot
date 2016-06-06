<template>
	<div class="search clear-fix">
		<div class="btn-group clear-fix">
			<a class="btn" @click="searchAsync(authorId)">查找</a>
			<a class="btn" @click="downloadPicListAsync(authorId, picList)">下载</a>
		</div>
		<div class="content clear-fix">
			<label>作者ID</label>
			<input
				@input="changeAuthorId"
				:value="authorId"
			>
		</div>
	</div>
	<div class="container">
		<div
			v-for="picItem in picList"
			:class="picItem.selected ? 'item-selected' : 'item'"
			:style="{width: picItem.width * 200 / picItem.height + 'px', flexGrow: picItem.width * 200 / picItem.height}"
			@click="selectPicItem($index)"
			:track-by="$index"
			>
			<div :style="{paddingBottom: picItem.height / picItem.width * 100 + '%'}"></div>
			<img :src="picItem.src" :alt="picItem.name" @load="changePicItemStyle($event, $index)">
			<div class="progress-box">
				<ring-alt :style="{display: picItem.progress > 0 ? 'block' : 'none'}" class="progress-main" :radius="30" :progress="picItem.progress" color2="rgba(0,0,0,.25)"></ring-alt>
			</div>
		</div>
	</div>
	<!-- <ripple class="loading" :style="{opacity: loading ? '1' : '0'}"></ripple> -->
</template>

<script lang="babel">
import store from 'renderer/vuex'
import * as actions from 'renderer/vuex/actions'
import Svg from 'renderer/components/Svg'
//迷之不支持解构
const Ripple = Svg.Ripple
const RingAlt = Svg.RingAlt

export default {
	store,
	vuex: {
		getters: {
			authorId: state => state.authorId,
			picList: state => state.picList
		},
		actions
	},
	components: {
		RingAlt,
		Ripple
	}
	// validator: function(val) {
	// 	console.log(val)
	// 	return val < 10
	// },
}
</script>

<style scoped lang="less">
@import "~renderer/variables";

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
			font-size: 14px;
			line-height: @input-height * .6;
			margin: @input-height * .2 0;
			border-radius: @input-height * .5;
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

	& > .item,
	& > .item-selected {
		margin: 2px;
		box-shadow: 0 0 3px @shadow-color;
		background-color: @main-color;
		position: relative;

		& > img {
			position: absolute;
			top: 0;
			width: 100%;
			vertical-align: bottom;
		}
		&:hover {
			box-shadow: 0 0 5px @main-color;
		}
	}

	& > .item-selected {
		&:after {
			content: '\25C6';
			position: absolute;
			left: 0;
			top: 0;
			line-height: 1;
			padding: 5px 15px 15px 8px;
			background-color: @main-color;
			color: white;
			border-bottom-right-radius: 100%;
		}
	}
}

.progress-box {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	top: 0;
	display: flex;
	align-items: center;
	justify-content: center;

	& > .progress-main {
		position: absolute;
		right: 0;
		bottom: 0;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		background-color: rgba(0,0,0,.25);
	}
}
</style>
