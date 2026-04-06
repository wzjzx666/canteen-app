var env = 'dev';

export const common = {
	env: env,
	dev: {
		SERVER_HOST: '',
		baseUrl: '',
	},
	getBaseUrl: function() {
		return this[common.env].baseUrl;
	},
	getServerHost() {
		return this[common.env].SERVER_HOST;
	}
};
export default common;