const ax = ({url='',data='',method='GET',tiptxt='加载中...'})=>{
	uni.showLoading({
		title: tiptxt
	});
	return new Promise((resolve,reject)=>{
		uni.request({
		    url: 'http://192.168.1.4:3000/api/'+url, //仅为示例，并非真实接口地址。
		    data,
			method,
		    header: {
		        'Authorization': uni.getStorageSync('mgtoken') //自定义请求头信息
		    },
		    success: (res) => resolve(res),
			fail:err => reject(err),
			complete:() => uni.hideLoading()
		});
	})
};
export default ax;