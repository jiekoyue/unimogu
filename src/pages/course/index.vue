<template>
	<view class="">
		<courselist :courses="courses" />
	</view>
</template>

<script>
	import courselist from '../../components/courselist/index.vue';
	import ax from '../../utils/ax.ts';
	export default {
		name: "",
		components: {
			courselist
		},
		data() {
			return {
				courses: []
			}
		},
		async onLoad() {
			let {
				data
			} = await ax({
				url: 'course/search'
			});
			this.courses = data.message;
		}
	}
</script>

<style scoped>

</style>
