"use strict";
var env = "dev";
const common = {
  env,
  dev: {
    SERVER_HOST: "http://localhost:3000",
    baseUrl: "http://localhost:3000"
  },
  getBaseUrl: function() {
    return this[common.env].baseUrl;
  },
  getServerHost() {
    return this[common.env].SERVER_HOST;
  }
};
exports.common = common;
