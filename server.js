const express = require('express');
const FormData = require('form-data'); // ← 确保引入的是 Node.js 版本
const path = require('path');
const multer = require('multer');
const app = express();
const fs = require('fs');
//======
//请修改config.js的配置
// win+R cmd  ipconfig 获取局域网的IPv4地址
// 修改存储图片文件夹和ipv4地址
// post.json 是图片，可能需要修改地址
// node upload_server.js 运行
//======
// 导入配置
const config = require('./config.js');
const postsPath = path.join(__dirname, 'posts.json');
if (!fs.existsSync(postsPath)) {
  fs.writeFileSync(postsPath, '[]');
}


const { IP, PORT } = config.SERVER;
const { UPLOAD_DIR, POSTS_FILE } = config.PATHS;

// ===== AI识别的照片存储 ======
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

app.use('/imgs', express.static(UPLOAD_DIR, { index: false }));
/*
app.post('/upload', multer({ storage }).single('file'), (req, res) => {
  const url = `http://${IP}:${PORT}/imgs/${req.file.filename}`;
  res.json({ code: 0, data: { url } });
});
*/
// 你的快瞳账号（注册后获得）
const ACCESS_KEY = 'APPID_70xq0i3IE19U505P';
const ACCESS_SECRET = '2fe2ae0f0b88e4b25056ad751506535f';
const TOKEN_URL = 'https://ai.inspirvision.cn/s/api/getAccessToken';
const DETECT_URL = 'https://ai.inspirvision.cn/s/api/domesticBirdType';
// ===== 上传 =====
app.post('/upload', multer({ storage }).single('file'), async (req, res) => {
  const coverUrl = `http://${IP}:${PORT}/imgs/${req.file.filename}`;
  console.log(coverUrl);

  // 1. 获取 token
  const token = await getToken();

  console.log("Token:",token);
  console.log("File:",req.file.path);
  // 2. 上传官方 API（用本地文件）
  const form = new FormData();
  form.append('token', token);
  form.append('file', fs.createReadStream(req.file.path), {
    filename: req.file.originalname, // 添加文件名
    contentType: req.file.mimetype    // 添加内容类型
  });
  const headers = form.headers;

  try {
    const { data: apiRes } = await axios.post(DETECT_URL, form, { headers: form.headers });
    console.log('=== 官方返回', JSON.stringify(apiRes, null, 2));
    // 3. 官方返回为空 → 未检测到
  if (apiRes.status !== 200 || !apiRes.data || !apiRes.data.pet || apiRes.data.pet.length === 0) {
    return res.json({ code: 1, msg: '未检测到鸟类' });
  }

  // 4. 取置信度最高框
  const top = apiRes.data.pet[0];
  const newPost = {
    id: Date.now(),
    originCover: coverUrl,
    cover: coverUrl,
    title: top.identification[0].chinese_name || '鸟类',
    desc: `置信度 ${((top.identification[0].confidence || 0) * 100).toFixed(1)}%`,
    tags: [top.identification[0].chinese_name || '鸟类', '观鸟', '官方API'],
    author: req.body.author || '我',
    avatar: 'https://i.pravatar.cc/150?img=' + (Math.floor(Math.random() * 30) + 1),
    likes: 0,
    location: req.body.location || '',
    createTime: new Date().toISOString(),
    conf: top.identification[0].confidence || 0,
    ai: true
  };

  // 5. 落盘
  let posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  posts.unshift(newPost);
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

  // 6. 返回小程序
  res.json({ code: 0, data: { post: newPost } });
  } catch (err) {
    // ← 强制打印完整错误
    console.error('=== Axios 错误', err.response?.data || err.message);
    return res.json({ code: 1, msg: err.response?.data?.message || err.message });
  }
  
});

// ===== 拉取列表 =====
app.get('/api/posts', (req, res) => {
  const page = Number(req.query.page) || 1;
  const size = Number(req.query.size) || 20;
  
  fs.readFile(POSTS_FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ code: 1, msg: 'read error' });
    const all = JSON.parse(data);
    const start = (page - 1) * size;
    const dataPage = all.slice(start, start + size);
    res.json({ code: 0, data: dataPage, total: all.length });
  });
});


// ==== 鉴权 ====
const axios = require('axios');



// 简单内存缓存（7 天）
let tokenCache = { value: '', expire: 0 };

async function getToken() {
  if (Date.now() < tokenCache.expire) return tokenCache.value;

  const { data } = await axios.get(TOKEN_URL, {
    params: { accessKey: ACCESS_KEY, accessSecret: ACCESS_SECRET }
  });
  if (data.status !== 200) throw new Error(data.message);
  else console.log("login successful");

  tokenCache = {
    value: data.data.access_token,
    expire: Date.now() + data.data.expires_in * 1000 - 60000 // 提前 1 分钟过期
  };
  return tokenCache.value;
}

// 

app.listen(PORT, () => console.log(`LAN upload http://${IP}:${PORT}`));