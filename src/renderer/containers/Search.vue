<template>
	<div class="search">
		<ui-textbox class="search-content" name="authorId" type="text" placeholder="ID/URL" @input="changeSearchContent" :value="authorId" :validation-messages="validationMessages" :validation-rules="validationRules"></ui-textbox>
		<div class="btn-group search-btn-group">
			<ui-button class="btn search-btn" text="查找" @click="searchAsync(authorId)"></ui-button>
			<ui-button class="btn search-btn" text="全选"></ui-button>
			<ui-button class="btn search-btn" text="下载" @click="downloadPicListAsync(authorId, handledPicList)"></ui-button>
		</div>
	</div>
	<div class="container">
		<div
			v-for="picItem in handledPicList"
			:class="picItem.selected ? 'item-selected' : 'item'"
			:style="{width: picItem.width * 200 / picItem.height + 'px', flexGrow: picItem.width * 200 / picItem.height}"
			@click="selectPicItem($index)"
			:track-by="$index"
			>
			<div :style="{paddingBottom: picItem.height / picItem.width * 100 + '%'}"></div>
			<img :src="picItem.src" :alt="picItem.name" @load="imgOnLoad($event, $index)" @error="imgOnError($event)">
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
	computed: {
		handledPicList() {
			return this.picList.map((v) => {
				v.src = v.src.replace(/150x150/, '400x400')
				return v
			})
		}
	},
	data() {
		return {
			validationMessages: {regex: '［格式］数字: 123456(作者id) 或 网址: http://www.pixiv.net/member_illust.php?id=123456(作者id)'},
			validationRules: 'regex:/^((\\w{4,5}:\\/\\/)?www\\.pixiv\\.net\\/member_illust\\.php\\?id=)?\\d+(&.*)?$/'
		}
	},
	methods: {
		changeSearchContent(e) {
			//正则验证输入内容是否符合要求，并获取authorId，否则将store中的authorId置空
			const result = /^(?:(?:\w{4,5}:\/\/)?www\.pixiv\.net\/member_illust\.php\?id=)?(\d+(?:&.*)?)$/.exec(e.target.value)
			console.log(result)
			if (result)
				this.changeAuthorId(result[1])
			else
				this.changeAuthorId('')
		},
		imgOnLoad(e, index) {
			console.log('onload')
			const self = e.path[0]
			this.handledPicList[index].width = self.naturalWidth
			this.handledPicList[index].height = self.naturalHeight
		},
		imgOnError(e) {
			console.log('onerror')
			const self = e.path[0]
			//读取次数不存在时设为1
			self._loadTimes = self._loadTimes || 1

			//最大读取5次
			if (self._loadTimes < 3) {
				self.src = self.src
				self._loadTimes++
			}
		}
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
	min-width: 800px;
	text-align: center;
	padding: 20px 0;

	&-btn-group,
	&-btn {
		vertical-align: top;
	}

	&-btn {
		width: 60px;
		margin: 0;
	}

	&-content {
		display: inline-block;
		min-width: 400px;
		max-width: 800px;
		width: 60%;
		margin: 0 20px;
		text-align: left;
		white-space: nowrap;
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
