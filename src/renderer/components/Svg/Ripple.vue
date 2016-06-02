<template>
	<svg width='100' height='100' :style="{width: radius * 2, height: radius * 2}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
		<rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect>
		<g>
			<animate attributeName="opacity" :dur="duration" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="1;1;0"></animate>
			<circle cx="50" cy="50" r="40" :stroke="color2" fill="none" :stroke-width="thick" stroke-linecap="round">
				<animate attributeName="r" :dur="duration" repeatCount="indefinite" begin="0s" keyTimes="0;0.33;1" values="0;22;44"></animate>
			</circle>
		</g>
		<g>
			<animate attributeName="opacity" :dur="duration" repeatCount="indefinite" begin="1s" keyTimes="0;0.33;1" values="1;1;0"></animate>
			<circle cx="50" cy="50" r="40" :stroke="color1" fill="none" :stroke-width="thick" stroke-linecap="round">
				<animate attributeName="r" :dur="duration" repeatCount="indefinite" begin="1s" keyTimes="0;0.33;1" values="0;22;44"></animate>
			</circle>
		</g>
	</svg>
</template>

<script>
export default {
	name: 'ripple',
	props:{
		radius: {
			type: Number,
			default: 100
		},
		thick: {
			type: Number,
			default: 8
		},
		color1: {
			type: String,
			default: '#2c6'
		},
		color2: {
			type: String,
			default: '#ddd'
		},
		bgColor: {
			type: String,
			default: '#fff'
		},
		duration: {
			type: String,
			default: '2s'
		},
	}
}
</script>
