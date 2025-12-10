// 模拟数据源，供本地 Promise 接口读取
export const canteens = [
  {
    id: 1,
    name: '北苑食堂',
    location: '北区教学楼旁',
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=1200&q=60',
    rating: 4.7,
  },
  {
    id: 2,
    name: '南苑食堂',
    location: '图书馆对面',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=1200&q=60',
    rating: 4.6,
  },
  {
    id: 3,
    name: '东苑清真餐厅',
    location: '体育馆东侧',
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=1200&q=60',
    rating: 4.8,
  },
];

export const categories = [
  { id: 101, canteenId: 1, name: '热销' },
  { id: 102, canteenId: 1, name: '盖浇饭' },
  { id: 103, canteenId: 1, name: '面点' },
  { id: 201, canteenId: 2, name: '麻辣香锅' },
  { id: 202, canteenId: 2, name: '小炒' },
  { id: 301, canteenId: 3, name: '清真特色' },
  { id: 302, canteenId: 3, name: '烧烤' },
];

export const dishes = [
  {
    id: 1001,
    categoryId: 101,
    name: '红烧肉盖饭',
    price: 18.5,
    stock: 36,
    image:
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sales: 320,
    description: '五花肉慢炖入味，搭配时蔬与米饭。',
    onShelf: true, // 上架状态
  },
  {
    id: 1002,
    categoryId: 101,
    name: '番茄牛腩饭',
    price: 19.8,
    stock: 28,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
    sales: 280,
    description: '番茄熬制，牛腩软烂多汁。',
    onShelf: true,
  },
  {
    id: 1003,
    categoryId: 102,
    name: '咖喱鸡块饭',
    price: 16.8,
    stock: 45,
    image:
      'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?auto=format&w=800&q=60',
    sales: 260,
    description: '椰香咖喱，微辣开胃。',
    onShelf: true,
  },
  {
    id: 1004,
    categoryId: 103,
    name: '牛肉刀削面',
    price: 15.0,
    stock: 52,
    image:
      'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&w=800&q=60',
    sales: 190,
    description: '劲道刀削面，浓郁牛肉汤底。',
    onShelf: true,
  },
  {
    id: 2001,
    categoryId: 201,
    name: '经典麻辣香锅',
    price: 24.5,
    stock: 40,
    image:
      'https://images.pexels.com/photos/2931286/pexels-photo-2931286.jpeg?auto=compress&cs=tinysrgb&w=1200',
    sales: 410,
    description: '麻中带辣，荤素搭配，香气扑鼻。',
    onShelf: true,
  },
  {
    id: 2002,
    categoryId: 202,
    name: '小炒黄牛肉',
    price: 22.0,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&w=800&q=60',
    sales: 220,
    description: '现炒现做，香辣爽口。',
    onShelf: false,
  },
  {
    id: 3001,
    categoryId: 301,
    name: '清真牛肉抓饭',
    price: 25.0,
    stock: 34,
    image:
      'https://images.unsplash.com/photo-1490642914619-7955af4c0f06?auto=format&w=800&q=60',
    sales: 150,
    description: '新疆风味抓饭，颗粒分明，肉香十足。',
    onShelf: true,
  },
  {
    id: 3002,
    categoryId: 302,
    name: '孜然羊肉串',
    price: 5.0,
    stock: 120,
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&w=800&q=60',
    sales: 500,
    description: '炭火直烤，孜然飘香，外焦里嫩。',
    onShelf: true,
  },
];

export const orders = [
  {
    id: 'ORD-202401',
    status: 0,
    items: [
      { dishId: 1001, count: 1, price: 18.5, name: '红烧肉盖饭' },
      { dishId: 1004, count: 2, price: 15.0, name: '牛肉刀削面' },
    ],
    totalPrice: 48.5,
    canteenId: 1,
  },
  {
    id: 'ORD-202402',
    status: 1,
    items: [{ dishId: 2001, count: 1, price: 24.5, name: '经典麻辣香锅' }],
    totalPrice: 24.5,
    canteenId: 2,
  },
  {
    id: 'ORD-202403',
    status: 2,
    items: [{ dishId: 3001, count: 2, price: 25.0, name: '清真牛肉抓饭' }],
    totalPrice: 50.0,
    canteenId: 3,
  },
];

export const user = {
  name: '李同学',
  studentId: '20230001',
  balance: 128.5,
  avatar:
    'https://images.unsplash.com/photo-1502720705749-3c9255857623?auto=format&w=400&q=60',
};

// 简单映射，便于订单展示读取食堂信息
export const canteenMap = canteens.reduce((acc, cur) => {
  acc[cur.id] = cur;
  return acc;
}, {});
