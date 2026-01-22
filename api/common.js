var env = 'dev';

export const common = {
	env: env,
	dev: {
		SERVER_HOST: 'http://localhost:3000',
		baseUrl: 'http://localhost:3000',
	},
	getBaseUrl: function() {
		return this[common.env].baseUrl;
	},
	getServerHost() {
		return this[common.env].SERVER_HOST;
	}
};
export default common;