"use strict";
const src_utils_mockjs = require("../utils/mockjs.js");
const common_vendor = require("../../common/vendor.js");
const src_mock_data = require("./data.js");
const src_utils_storage = require("../utils/storage.js");
const accountTemplates = [
  {
    id: 1,
    username: "20230001",
    password: "student123",
    role: "student",
    studentId: "20230001"
  },
  {
    id: 2,
    username: "T2023",
    password: "teacher123",
    role: "teacher",
    studentId: "20231001"
  },
  {
    id: 3,
    username: "ADM001",
    password: "admin123",
    role: "admin",
    studentId: "ADM001"
  }
];
const accounts = accountTemplates.map((item) => {
  var _a, _b, _c;
  return {
    ...item,
    passwordHash: common_vendor.md5(item.password),
    nickname: ((_a = src_mock_data.users[item.role]) == null ? void 0 : _a.name) || "智慧食堂用户",
    avatar: ((_b = src_mock_data.users[item.role]) == null ? void 0 : _b.avatar) || "",
    balance: ((_c = src_mock_data.users[item.role]) == null ? void 0 : _c.balance) || 0
  };
});
const mockLogin = async ({ username, password, role }) => new Promise((resolve) => {
  setTimeout(() => {
    const localAccounts = src_utils_storage.getLocalAccounts() || [];
    const allAccounts = [
      ...localAccounts,
      ...accounts
    ];
    const match = allAccounts.find(
      (item) => item.username == username && item.role === role
    );
    if (!match) {
      resolve({
        code: 404,
        success: false,
        error: "用户不存在或角色不匹配"
      });
      return;
    }
    if (match.passwordHash !== password) {
      resolve({
        code: 401,
        success: false,
        error: "密码错误"
      });
      return;
    }
    const token = src_utils_mockjs.Mock.mock("@guid");
    resolve({
      code: 200,
      success: true,
      msg: "登录成功",
      data: {
        token: `Bearer ${token}`,
        user: {
          id: match.id,
          username: match.username,
          role: match.role,
          nickname: match.nickname,
          avatar: match.avatar,
          balance: match.balance,
          studentId: match.studentId
        }
      }
    });
  }, 600);
});
exports.mockLogin = mockLogin;
