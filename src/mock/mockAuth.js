import Mock from '../utils/mockjs';
import md5 from 'js-md5';
import { users } from './data';
import { getLocalAccounts } from '../utils/storage';

const accountTemplates = [
  {
    id: 1,
    username: '20230001',
    password: 'student123',
    role: 'student',
    studentId: '20230001',
  },
  {
    id: 2,
    username: 'T2023',
    password: 'teacher123',
    role: 'teacher',
    studentId: '20231001',
  },
  {
    id: 3,
    username: 'ADM001',
    password: 'admin123',
    role: 'admin',
    studentId: 'ADM001',
  },
];

const accounts = accountTemplates.map((item) => ({
  ...item,
  passwordHash: md5(item.password),
  nickname: users[item.role]?.name || '智慧食堂用户',
  avatar: users[item.role]?.avatar || '',
  balance: users[item.role]?.balance || 0,
}));

export const mockLogin = async ({ username, password, role }) =>
  new Promise((resolve) => {
    setTimeout(() => {
      const localAccounts = getLocalAccounts() || [];
      const allAccounts = [
        ...localAccounts,
        ...accounts,
      ];

      const match = allAccounts.find(
        (item) => item.username == username && item.role === role,
      );

      if (!match) {
        resolve({
          code: 404,
          success: false,
          error: '用户不存在或角色不匹配',
        });
        return;
      }
      if (match.passwordHash !== password) {
        resolve({
          code: 401,
          success: false,
          error: '密码错误',
        });
        return;
      }
      const token = Mock.mock('@guid');
      resolve({
        code: 200,
        success: true,
        msg: '登录成功',
        data: {
          token: `Bearer ${token}`,
          user: {
            id: match.id,
            username: match.username,
            role: match.role,
            nickname: match.nickname,
            avatar: match.avatar,
            balance: match.balance,
            studentId: match.studentId,
          },
        },
      });
    }, 600);
  });
