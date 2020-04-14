<template>
	<view class="mp-circle-container">
		<canvas class="mp-circle" :canvas-id="'canid'+criid" :style="{width: wt+'px',height: ht+'px'}"></canvas>
	</view>
</template>

<script>
	export default {
		props: {
			criid: {
				type: String
			},
			wt: {
				type: Number,
				default: 56
			},
			ht: {
				type: Number,
				default: 56
			},
			lwt: {
				type: Number,
				default: 5
			},
			jd: {
				type: Number,
				default: 100
			}
		},
		data() {
			return {
				myForegroundColor: '#FF783B'
			}
		},
		methods: {
			hh() {
				let fontwt;
				if (this.jd <= 30) {
					this.myForegroundColor = '#ff0000';
				} else if (this.jd > 30 && this.jd < 50) {
					this.myForegroundColor = '#FF783B'
				} else {
					this.myForegroundColor = '#B4D66E'
				}
				if (this.jd < 10) {
					fontwt = 6;
				} else if (this.jd < 100) {
					fontwt = 10;
				} else {
					fontwt = 14;
				}
				const ctx = uni.createCanvasContext('canid' + this.criid, this);
				//画底色
				ctx.beginPath();
				ctx.setLineWidth(this.lwt);
				ctx.setStrokeStyle('#f3f3f3');
				ctx.arc(this.wt / 2 + this.lwt / 2, this.ht / 2 + this.lwt / 2, this.wt / 2 - this.lwt, 0, 2 * Math.PI, true);
				ctx.stroke();
				//画进度
				ctx.beginPath();
				ctx.setLineWidth(this.lwt);
				ctx.setStrokeStyle(this.myForegroundColor);
				ctx.setLineCap('round');
				ctx.arc(this.wt / 2 + this.lwt / 2, this.ht / 2 + this.lwt / 2, this.wt / 2 - this.lwt, -0.5 * Math.PI, ((2 * this.jd /
					100) - 0.5) * Math.PI);
				ctx.stroke();
				//画字体
				ctx.beginPath();
				ctx.setFontSize(12)
				ctx.setFillStyle(this.myForegroundColor)
				ctx.fillText(this.jd + '%', this.wt / 2 - fontwt, this.ht / 2 + 7)
				ctx.fill();
				ctx.draw();
			}
		},
		onReady() {
			this.hh();
		}
	}
</script>

<style scoped>
	.mp-circle-container {
		position: relative;
	}

	.mp-circle {
		position: absolute;
		left: 0;
		right: 0;
		margin: auto;
	}
</style>
