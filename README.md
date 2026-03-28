# 🌅 Life 30,000 Days | 人生三万天

> Every day is a one-of-a-kind gift

A beautiful mindfulness web app that visualizes your life's remaining days. Enter your birthday to see how many days you've lived and how many remain — with daily motivation, wallpapers, wellness tools, and more.

一个关于时间、生命与珍惜的 Web 应用。

**[🚀 Live Demo](https://life-30000-days.vercel.app)** | **[🌅 Product Hunt](https://www.producthunt.com)** | **[🔥 爱发电支持](https://afdian.com/a/sherlock1412)**

## ✨ 功能特性

### 🎯 核心功能
- **生命倒计时** — 精确计算已度过和剩余的天数
- **生命进度环** — 可视化展示人生进度
- **每日金句** — 60+ 条精选激励语句，每天自动更换
- **生命时间线** — 用像素点可视化你的人生
- **人生里程碑** — 追踪重要人生节点
- **趣味数据** — 心跳、呼吸、步数等生活数据估算

### 🎨 壁纸生成器
- 6 种风格：渐变、宇宙、自然、极简、复古、水彩
- 5 种尺寸：手机、桌面、Instagram、iPhone 15 Pro、2K
- 一键下载，每天自动生成不同的壁纸

### 📱 小组件
- 小组件（小）— 剩余天数 + 进度条
- 小组件（中）— 进度环 + 金句 + 统计数据
- 网页嵌入代码 — 可嵌入任何网页

### 💡 解压工具箱
- **呼吸练习** — 4-7-8 呼吸法、方块呼吸、快速放松
- **泡泡解压** — 点击泡泡释放压力的小游戏
- **解压贴士** — 15 条科学验证的减压方法
- **解压语录** — 12 条治愈系语录，点击可复制

### 🎵 白噪音播放器
- 12 种环境音：雨声、海浪、篝火、森林、风声、雷雨、夏夜、咖啡馆、键盘、火车、雪天、溪流
- 可同时混合多种声音，创造专属氛围
- 每种声音独立音量控制

### 📝 每日感恩日记
- 每天记录 3 件感恩的事
- 随机提示问题引导思考
- 连续天数统计

### 🧘 冥想计时器
- 5/10/15/20/30 分钟预设
- 渐变环形进度可视化
- 累计冥想次数和时长统计

### 📊 年度生命报告
- 生命阶段识别（幼儿期→黄金期）
- 生命中的数字：心跳、呼吸、睡眠、步数
- 今年进度追踪

### 🎲 每日挑战
- 26 种创意/社交/健康/学习/生活类挑战
- 每天自动推荐一个
- 连续完成天数统计

### 🏆 成就系统
- 30+ 个可解锁成就
- 成就解锁弹窗动画通知

### 💰 变现
- Google AdSense 广告集成
- 爱发电捐赠支持：[afdian.com/a/sherlock1412](https://afdian.com/a/sherlock1412)
- Buy Me a Coffee 支持
- Premium 激活码系统

## 🚀 快速开始

```bash
git clone https://github.com/Sherlock1412-cell/life-30000-days.git
cd life-30000-days
python3 -m http.server 8080
```

打开 http://localhost:8080

## 📁 项目结构

```
life-30000-days/
├── index.html          # 主页面
├── css/style.css       # 样式
├── js/
│   ├── app.js          # 主应用逻辑 (v2.0)
│   ├── quotes.js       # 金句数据库 (60+)
│   ├── tips.js         # 解压工具
│   ├── wallpaper.js    # 壁纸生成引擎
│   └── features.js     # 新功能模块 (白噪音/冥想/感恩/挑战/成就/报告)
├── widget/widget.html  # 嵌入式小组件
├── assets/             # 图标 & 社交分享图
├── manifest.json       # PWA 配置
├── sw.js               # Service Worker
├── netlify.toml        # Netlify 部署配置
└── README.md
```

## 🛠️ 技术栈

纯前端 — HTML + CSS + JavaScript，无框架依赖

## 📜 License

MIT

## ☕ 支持

如果这个项目对你有帮助，欢迎请我喝杯咖啡：
- 🔥 [爱发电](https://afdian.com/a/sherlock1412)
- ☕ [Buy Me a Coffee](https://buymeacoffee.com/sherlock1412)
