import common from '/api/common.js';

const Config = {
	domain: common.getBaseUrl(),
	token: undefined,
	tenantId: '000000',
	appid: 'saber',
	appkey: 'saber_secret'
};

const setToken = function(token) {
	try {
		uni.setStorageSync('token', token);
		Config.token = token;
	} catch (e) {}
};

const stringToBase64 = function(str) {
	return base64_encode(str)
}

function base64_encode(str) {
	var c1, c2, c3;
	var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var i = 0,
		len = str.length,
		string = '';

	while (i < len) {
		c1 = str.charCodeAt(i++) & 0xff;
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt((c1 & 0x3) << 4);
			string += "==";
			break;
		}
		c2 = str.charCodeAt(i++);
		if (i == len) {
			string += base64EncodeChars.charAt(c1 >> 2);
			string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			string += base64EncodeChars.charAt((c2 & 0xF) << 2);
			string += "=";
			break;
		}
		c3 = str.charCodeAt(i++);
		string += base64EncodeChars.charAt(c1 >> 2);
		string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
		string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
		string += base64EncodeChars.charAt(c3 & 0x3F)
	}
	return string
}


async function apiReq(url, data, options = {}) {
	// console.log(options)
	const {
		showLoading = true,
			loadingText = '加载中...',
			method = 'POST',
			type = 0
	} = options;
	// console.log(method)
	if (showLoading) {
		uni.showLoading({
			title: loadingText,
			mask: true
		});
	}
	const auth = stringToBase64(`${Config.appid}:${Config.appkey}`);
	// const auth = 'c2FiZXI6c2FiZXJfc2VjcmV0';
	try {
		const response = await uni.request({
			url: url.startsWith('http') ? url : Config.domain + url,
			data: data,
			header: {
				'Blade-Auth': uni.getStorageSync('token') || '',
				'Authorization': 'Basic ' + auth,
				'Tenant-Id': Config.tenantId,
				'content-type': type === 0 ? 'application/json' : 'application/x-www-form-urlencoded',
			},
			method: method,
		});
		const responseData = response.data;

		if (responseData.error) {
			uni.showToast({
				icon: 'none',
				title: responseData.error_description
			});
			return
		}
		if (responseData.access_token && responseData.token_type) {
			uni.setStorageSync('token', `${responseData.token_type} ${responseData.access_token}`)
			if (showLoading) {
				uni.hideLoading();
			}
			return responseData;
		}
		if (responseData.code === 200 || responseData.code === 400) {
			if (showLoading) {
				uni.hideLoading();
			}
			return responseData;
		} else if (responseData.code === 401) {
			console.log('401进来了')
			uni.setStorageSync('token', '');
			uni.setStorageSync('roleName', '');
			uni.navigateTo({
				url: '/pages/login/login'
			})
			if (showLoading) {
				uni.hideLoading();
			}
		} else {
			if (showLoading) {
				uni.hideLoading();
			}
		}
	} catch (error) {
		console.error(error);
		if (showLoading) {
			uni.hideLoading();
		}
	}
}


async function apiReqFile(url, data, options = {}) {
	console.log(options)
	const {
		showLoading = true,
			loadingText = '加载中...',
			method = 'POST',
			type = 0
	} = options;
	console.log(method)
	if (showLoading) {
		uni.showLoading({
			title: loadingText,
			mask: true
		});
	}
	const auth = stringToBase64(`${Config.appid}:${Config.appkey}`);
	try {
		const response = await uni.downloadFile({
			url: url.startsWith('http') ? url : Config.domain + url,
			data: data,
			header: {
				'Blade-Auth': uni.getStorageSync('token') || '',
				'Authorization': 'Basic ' + auth,
				'Tenant-Id': Config.tenantId,
				'content-type': type === 0 ? 'application/json' : 'application/x-www-form-urlencoded',
			},
			method: method,
		});
		const responseData = response.data;
		if (responseData.error) {
			uni.showToast({
				icon: 'none',
				title: responseData.error_description
			});
			return
		}
		if (responseData.access_token && responseData.token_type) {
			uni.setStorageSync('token', `${responseData.token_type} ${responseData.access_token}`)
			if (showLoading) {
				uni.hideLoading();
			}
			return responseData;
		}
		if (responseData.code === 200 || responseData.code === 400) {
			if (showLoading) {
				uni.hideLoading();
			}
			return responseData;
		} else if (responseData.code === 401) {
			uni.setStorageSync('token', '');
			uni.navigateTo({
				url: '/pages/login1/login'
			})
			if (showLoading) {
				uni.hideLoading();
			}
		} else {
			if (showLoading) {
				uni.hideLoading();
			}
		}
	} catch (error) {
		console.error(error);
		if (showLoading) {
			uni.hideLoading();
		}
	}
}

export default {
	config: Config,
	/*登录接口*/
	login(data) {
		return apiReq('/api/auth/login', data);
	},
	// 创建用户
	createUser(data) {
		return apiReq('/api/users', data, {
			method: 'POST',
			type: 1
		})
	},
}