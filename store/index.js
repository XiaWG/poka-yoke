import Vue from 'vue';
import Vuex from 'vuex';
import i18n from '@/i18n'
import { getLang } from '@/utils/util.js'
Vue.use(Vuex);
import v1 from './v1.js';
import { getNewNum } from "../api/remote";

const lang = uni.getStorageSync('lang') || getLang();
const langPack = Object.assign({}, i18n[lang])
export default new Vuex.Store({
	state: {
		// accessToken: sessionStorage.getItem('accessToken') || '',
		accessToken: '',
		lang,
		langPack,
		ANDROID_ID: '',
		selectOperate: {
			id: '',
      code: '',
		},
		email: 'szsofttech@163.com',
		id: '',
		jobNumber: '',
		menus: [],
		name: 'admin',
		telephone: '18112902283',
		userRole: '',
		shouldAutoLogin: true,
		newsRefreshTime: 2,
		serv: '',
		defaultServ: '',
		stateMachineList: [],
		beepNum: ''
	},
	modules: {
		v1,
	},
	mutations: {
		updateState(state, payload) {
			// #ifdef H5
			uni.setStorageSync("accessToken", payload.accessToken||'');
			// #endif
			Object.assign(state, payload);
		},
		updateLang(state, payload) {
			const langPack = Object.assign({}, i18n[payload]);
			uni.setStorageSync('lang',  payload);
			this.commit('updateState', {
				lang: payload,
				langPack,
			});
			this.commit('setTab');
		},
		setTab(state) {
			uni.setTabBarItem({
				index: 0,
				text: state.langPack['lang.ot.app.news'],
			})
			uni.setTabBarItem({
				index: 1,
				text: state.langPack['lang.ot.app.menu'],
			})
			uni.setTabBarItem({
				index: 2,
				text: state.langPack['lang.ot.app.mine'],
			})
		},
		SETSERV(state, payload) {
			state.serv = payload
			uni.setStorageSync('serv',  payload)
		},
		SETDEFAULTSERV(state, payload) {
			state.defaultServ = payload
			uni.setStorageSync('defaultServ',  payload)
		},
		SETBEEP(state, payload) {
			state.beepNum = payload
			uni.setStorageSync('beepNum',  payload)
		},
	},
	actions: {

	},
});
