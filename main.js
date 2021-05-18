// #ifdef H5
// import '@/utils/pc.js'; uni.EBBDDF8
// #endif
import Vue from 'vue'
import App from './App'
import store from './store/index';
import rules from './utils/rules';
import {host, defaultHost} from '@/config/http.config.js';

Vue.prototype.$store = store
Vue.prototype.$t = (key) => store.state.langPack[key] || key
Vue.prototype.$msgTimer = null;
Vue.prototype.$rules = rules;
Vue.prototype.$setTitle = (code) => {
  uni.setNavigationBarTitle({
    title: store.state.langPack[code],
  });
};

function formatterTime(value, now, type) {
  if (now && !value) value = new Date()
  if (!value) return '--'
  try {
    value = new Date(value)
  }
  catch(e) {
    return '--'
  }
  let ret = {}
  ret.y = value.getFullYear()
  ret.m = value.getMonth()
  ret.d = value.getDate()
  ret.hh = value.getHours()
  ret.mm = value.getMinutes()
  ret.ss = value.getSeconds()
  ret.str = ret.y + '-' + (ret.m < 9 ? '0' + (ret.m + 1) : (ret.m + 1)) + '-' + (ret.d < 10 ? '0' + ret.d : ret.d)
  if (now) return ret.str
  if (type === 1) return ret.str
  if (!(ret.hh === 0 && ret.mm === 0 && ret.ss === 0)) {
    ret.str += ' ' + (ret.hh < 10 ? '0' + ret.hh : ret.hh) + ':' + (ret.mm < 10 ? '0' + ret.mm : ret.mm) + ':' + (ret.ss < 10 ? '0' + ret.ss : ret.ss)
  }
  return ret.str
} 
Vue.filter('formatterTime', formatterTime);
Vue.prototype.$formatterTime = formatterTime;
Vue.prototype.$warning = (vibrate = true, beep = true) => {
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

Vue.prototype.$Voice = (src) => {
  if (!src) return  
  //实例化声音  
  const Audio = uni.createInnerAudioContext()
  Audio.autoplay = true
  Audio.src = src //音频地址  
  Audio.play() //执行播放  
  Audio.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  });
  Audio.onPause(function() {
    console.log('end')
    Audio.destroy()
  })
}

if (uni.getStorageSync("serv")) {
  store.commit('SETSERV', uni.getStorageSync("serv"))
} else {
  store.commit('SETSERV', host)
}

if (uni.getStorageSync("beepNum")) {
  store.commit('SETBEEP', uni.getStorageSync("beepNum"))
} else {
  store.commit('SETBEEP', 3)
}

if (uni.getStorageSync("defaultServ")) {
  store.commit('SETDEFAULTSERV', uni.getStorageSync("defaultServ"))
} else {
  store.commit('SETDEFAULTSERV', defaultHost)
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
})
app.$mount();
export default app;
