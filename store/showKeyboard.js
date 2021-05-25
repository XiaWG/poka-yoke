export default {
	namespaced: true,
	state: {
		showKeyBoard: false,
		ketBoardTimer: null,
	},
	modules: {},
	mutations: {
		SET_KEYBOARD_TIMER(state, payload) {
			if (payload) {
				state.showKeyBoard = !state.showKeyBoard
				uni.showToast({
					title: state.showKeyBoard ? '键盘开启' : '键盘关闭',
					duration: 2000,
					icon: "none",
				})
			}			
			clearInterval(state.ketBoardTimer)
      state.ketBoardTimer = state.showKeyBoard ? null : setInterval(() => {
        //#ifdef APP-PLUS
        uni.hideKeyboard()
        //#endif
      }, 10)
		},
		SET_KEYBOARD_TIMER_CLEAR(state, payload) {
			clearInterval(state.ketBoardTimer)
			state.ketBoardTimer = null
		}
	},
	actions: {

	},
};
