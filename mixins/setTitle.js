import { mapState } from 'vuex';

export default {
	computed: {
		...mapState(['langPack']),
	},
	methods: {
		setTitle(code) {
			uni.setNavigationBarTitle({
				title: this.langPack[code],
			});
		}
	},
};
