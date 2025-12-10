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
  {
    id: 4,
    name: '西苑美食广场',
    location: '学生公寓西侧',
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=1200&q=60',
    rating: 4.5,
  },
  
];

export const categories = [
  { id: 101, canteenId: 1, name: '热销' },
  { id: 102, canteenId: 1, name: '盖浇饭' },
  { id: 103, canteenId: 1, name: '面点' },
  { id: 104, canteenId: 1, name: '汤类' },
  { id: 105, canteenId: 1, name: '素食' },
  { id: 201, canteenId: 2, name: '麻辣香锅' },
  { id: 202, canteenId: 2, name: '小炒' },
  { id: 203, canteenId: 2, name: '火锅' },
  { id: 204, canteenId: 2, name: '川菜' },
  { id: 301, canteenId: 3, name: '清真特色' },
  { id: 302, canteenId: 3, name: '烧烤' },
  { id: 303, canteenId: 3, name: '新疆风味' },
  { id: 304, canteenId: 3, name: '西北风味' },
  { id: 401, canteenId: 4, name: '西式快餐' },
  { id: 402, canteenId: 4, name: '日韩料理' },
  { id: 403, canteenId: 4, name: '甜品饮品' },
  { id: 404, canteenId: 4, name: '东南亚菜' },
  { id: 405, canteenId: 4, name: '轻食沙拉' },
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
      'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg?auto=compress&cs=tinysrgb&w=1200',
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
    "id": 3001,
    "categoryId": 301,
    "name": "清真牛肉抓饭",
    "price": 25.0,
    "stock": 34,
    "image": "https://qcloud.dpfile.com/pc/9ra4bF5NkCm5F2NcDPHoHwSRzALUWXpLi6fO30jxyVKetTJPCukyTGns-vo8-MYZ.jpg",
    "sales": 150,
    "description": "新疆风味抓饭，颗粒分明，肉香十足。",
    "onShelf": true
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
  {
    id: 4001,
    categoryId: 401,
    name: '意大利肉酱面',
    price: 22.0,
    stock: 35,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
    sales: 180,
    description: '经典意式风味，手工面条配浓郁肉酱。',
    onShelf: true,
  },
  {
    id: 4002,
    categoryId: 401,
    name: '芝士汉堡套餐',
    price: 28.0,
    stock: 42,
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=800&q=60',
    sales: 210,
    description: '双层牛肉饼，配上新鲜蔬菜和芝士。',
    onShelf: true,
  },
  {
    id: 4003,
    categoryId: 402,
    name: '寿司拼盘',
    price: 35.0,
    stock: 25,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=800&q=60',
    sales: 120,
    description: '精选新鲜食材制作，包含三文鱼、金枪鱼等。',
    onShelf: true,
  },
  {
    id: 4004,
    categoryId: 403,
    name: '芒果冰沙',
    price: 12.0,
    stock: 60,
    image:
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&w=800&q=60',
    sales: 95,
    description: '新鲜芒果制成，清凉解暑。',
    onShelf: true,
  },
  // 北苑食堂新增菜品
  {
    id: 1005,
    categoryId: 102,
    name: '红烧排骨饭',
    price: 20.0,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 150,
    description: '精选猪排红烧至入味，肉质鲜嫩，搭配白米饭。',
    onShelf: true,
  },
  {
    id: 1006,
    categoryId: 104,
    name: '紫菜蛋花汤',
    price: 8.0,
    stock: 50,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 220,
    description: '清淡鲜美，紫菜富含营养，是经典的汤品。',
    onShelf: true,
  },
  {
    id: 1007,
    categoryId: 105,
    name: '香菇青菜',
    price: 10.0,
    stock: 35,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 130,
    description: '新鲜香菇搭配时令青菜，健康营养的素食选择。',
    onShelf: true,
  },
  // 南苑食堂新增菜品
  {
    id: 2003,
    categoryId: 203,
    name: '麻辣火锅',
    price: 38.0,
    stock: 20,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 95,
    description: '正宗川味火锅，麻辣鲜香，配菜丰富。',
    onShelf: true,
  },
  {
    id: 2004,
    categoryId: 204,
    name: '口水鸡',
    price: 18.0,
    stock: 25,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 145,
    description: '经典川菜，鸡肉嫩滑，麻辣中带甜。',
    onShelf: true,
  },
  // 东苑清真餐厅新增菜品
  {
    id: 3003,
    categoryId: 303,
    name: '手抓羊肉',
    price: 32.0,
    stock: 20,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 110,
    description: '精选宁夏滩羊，肉质鲜嫩无膻味，传统手抓做法。',
    onShelf: true,
  },
  {
    id: 3004,
    categoryId: 304,
    name: '兰州牛肉面',
    price: 12.0,
    stock: 45,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 200,
    description: '一清二白三红四绿五黄，正宗兰州风味。',
    onShelf: true,
  },
  // 西苑美食广场新增菜品
  {
    id: 4005,
    categoryId: 404,
    name: '泰式冬阴功汤',
    price: 28.0,
    stock: 15,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 85,
    description: '正宗泰式风味，酸辣开胃，海鲜丰富。',
    onShelf: true,
  },
  {
    id: 4006,
    categoryId: 405,
    name: '凯撒沙拉',
    price: 22.0,
    stock: 30,
    image:
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&w=800&q=60',
    sales: 105,
    description: '新鲜罗马生菜，搭配烤面包丁和帕玛森芝士。',
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
  {
    id: 'ORD-202404',
    status: 0,
    items: [
      { dishId: 4002, count: 1, price: 28.0, name: '芝士汉堡套餐' },
      { dishId: 4004, count: 2, price: 12.0, name: '芒果冰沙' },
    ],
    totalPrice: 52.0,
    canteenId: 4,
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
