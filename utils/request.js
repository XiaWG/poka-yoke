import store from '../store/index';
import {
	paramsStringify
} from './util.js'
import app from '@/main.js';
import i18n from "@/i18n/index.js";

const REQUEST_TIMEOUT = 120; // 请求超时时间：秒
/**
 * Requests a URL, return a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

function $warning (vibrate = true, beep = true) {
	const num = store.state.beepNum || 3
  //#ifdef APP-PLUS
  if (plus) {
    if (vibrate) {
      plus.device.vibrate()
    }
    if (beep) {
      plus.device.beep(num)
    }
  }
  //#endif
}

export default (url, options = {}) => {
	const {
		method = 'get', headers = {}, params = {}, body = {}, default_url
	} = options;
	let _url = default_url ? store.state.defaultServ : store.state.serv
	
	const upMethod = method.toUpperCase();
	const requestUrl = Object.keys(params).length ?
		`${_url}${url}?${paramsStringify(params)}` :
		`${_url}${url}`;
	const accessToken = store.state.accessToken || uni.getStorageSync('accessToken')
	const authorization = accessToken ? {
		'Access-Token': accessToken,
	} : {};
	return new Promise((resolve, reject) => {
		uni.request({
			url: requestUrl,
			method: upMethod,
			data: body,
			header: {
				'lang': store.state.lang,
				macAddress: store.state.ANDROID_ID || '',
				...authorization,
				...headers,
			},
			success: (res) => {
				if ([0, 301].includes(res.data.code)) {
					resolve(res.data)
				} else {
					reject(res)
				}
			},
			fail: (error) => {
				reject(error);
			}
		});
	}).catch((error) => {
		if (error.data) {
			const errorMsg = error.data.msg
			if (error.statusCode === 401 || error.statusCode === 403) {
				// 验证不通过，重新登录 跳转登录页
			} else {
				$warning() 
				uni.showToast({
					title: errorMsg,
					duration: 5000,
					icon: 'none',
					position: 'top'
				})
			}
		} else {
			uni.showToast({
				title: '网络错误，请重试！',
				duration: 2000,
				icon: 'none',
			});
		}
	});
}