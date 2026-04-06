"use strict";
var env = "dev";
const common = {
  env,
  dev: {
    SERVER_HOST: "",
    baseUrl: ""
  },
  getBaseUrl: function() {
    return this[common.env].baseUrl;
  },
  getServerHost() {
    return this[common.env].SERVER_HOST;
  }
};
exports.common = common;
