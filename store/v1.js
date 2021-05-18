export default {
	namespaced: true,
	state: {
		tableList: [],
	},
	modules: {},
	mutations: {
		updateState(state, payload) {
			Object.assign(state, payload);
		},
	},
	actions: {

	},
};
