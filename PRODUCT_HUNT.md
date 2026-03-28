# Product Hunt 发布准备 - 人生三万天

## 📌 基本信息

- **Product Name:** Life 30,000 Days
- **Tagline:** A beautiful life countdown that makes every day count
- **Website:** (部署后填写，推荐 Vercel/Netlify 免费部署)
- **Category:** Health & Fitness, Productivity, Design Tools
- **Topics:** mindfulness, wellness, self-improvement, life-tracking, daily-motivation

## 📝 Short Description (60 chars max)

> Visualize your life's remaining days & find daily motivation

## 📝 Full Description

```
🌅 Life 30,000 Days

What if you could see your entire life laid out in days?

Life 30,000 Days is a beautiful, mindfulness-focused web app that visualizes how many days you've lived and how many remain — turning abstract time into something you can feel.

✨ Core Features:
• Life Progress Ring — see your life's progress at a glance
• Life Timeline — a pixel grid of every day of your life
• Daily Wisdom — 60+ curated quotes that change every day
• Daily Micro-Joys — small daily happiness prompts
• Life Milestones — track important life stages
• Fun Stats — heartbeats, breaths, steps, meals you've had

🧘 Wellness Tools:
• Breathing Exercises — 4-7-8, box breathing, quick relaxation
• Meditation Timer — 5/10/15/20/30 min with progress ring
• Gratitude Journal — daily 3-item gratitude practice
• White Noise Player — 12 ambient sounds, mixable
• Stress Relief Games — bubble popping mini-game

🎨 Creative Features:
• Wallpaper Generator — 6 styles × 5 sizes, download daily wallpapers
• Desktop Widgets — embeddable life countdown widgets
• 30+ Achievements — unlock milestones across all features
• Annual Life Report — comprehensive life statistics

🎲 Daily Engagement:
• Random Challenges — 26 creative/social/health/learning tasks
• Streak Tracking — for gratitude, joys, challenges
• Achievement System — 30+ unlockable achievements

📱 Tech Highlights:
• Pure frontend — no backend, no tracking, privacy-first
• PWA support — install on phone, works offline
• Responsive — beautiful on desktop and mobile
• Dark theme with 6+ theme colors

Built with ❤️ as a reminder that life is precious.
```

## 🎯 Maker Comment (发布后置顶评论)

```
Hey Product Hunt! 👋

I built Life 30,000 Days after reading that the average human lives about 30,000 days. That number hit me hard.

We track our steps, our sleep, our screen time — but we rarely pause to think about the bigger picture: how many days have we actually lived, and how many might remain?

This app isn't meant to be morbid. It's the opposite. Seeing your life as a finite number of days makes each one more precious.

Some things I'm proud of:
• 60+ curated quotes (Chinese & English) with daily rotation
• 12 mixable white noise sounds (rain, ocean, fire, forest...)
• A meditation timer with progress visualization
• Wallpaper generator with 6 artistic styles
• 30+ achievements to unlock across all features
• 100% privacy — everything stays in your browser

It started as a simple countdown, but grew into a full mindfulness toolkit. Would love to hear what you think!

🙏 Thanks for checking it out.
```

## 🖼️ 截图建议 (Screenshots)

Product Hunt 需要以下素材：

### 必需素材
1. **Logo/Icon** — 240×240px，使用 🌅 emoji 或项目 icon
2. **Gallery 图片** — 1270×760px，至少 3 张
3. **Social 分享图** — 1200×630px

### 推荐截图内容
1. **主页面** — 展示生命进度环 + 金句 + 年度进度（核心卖点）
2. **壁纸生成器** — 展示 6 种风格之一的精美壁纸
3. **白噪音 + 冥想** — 展示 wellness 工具
4. **生命时间线** — 展示像素点人生可视化
5. **成就系统** — 展示游戏化元素

### 截图方法
在浏览器中打开项目 → F12 调整到 1270×760 → 截图

## 🚀 部署建议

Product Hunt 需要可访问的 URL。推荐：

### Vercel（推荐，免费）
```bash
npm i -g vercel
cd life-30000-days
vercel --prod
```

### Netlify Drop
访问 https://app.netlify.com/drop，直接拖拽文件夹即可

### GitHub Pages
在仓库 Settings → Pages → Source: main branch

## ⚠️ 发布前注意事项

1. **Premium 激活码安全问题** — 当前 `LIFE30000` 激活码硬编码在前端源码中，任何人都能看到。Product Hunt 用户更多会更容易发现。建议：
   - 移除硬编码激活码
   - 改为后端验证（可用 Firebase/Supabase 简单实现）
   - 或暂时隐藏 Premium 功能

2. **字体加载** — 依赖 Google Fonts，需确保海外访问正常

3. **收款链接** — `support-modal` 中的爱发电和 Buy Me a Coffee 链接需要更新为真实地址

## 📅 发布时间建议

- Product Hunt 最佳发布时间：**太平洋时间 周二/周三/周四 00:01 AM**
- 北京时间换算：**周三/周四/周五 下午 3:01 PM (夏令时) 或 4:01 PM (冬令时)**
- 2026年3月28日是周六，建议 **周二 3月31日** 或 **周三 4月1日** 发布

## 📋 发布清单

- [ ] 部署到可访问的 URL
- [ ] 准备 3-5 张 Gallery 截图 (1270×760)
- [ ] 准备 Logo (240×240)
- [ ] 准备 Social 分享图 (1200×630)
- [ ] 注册 Product Hunt 账号
- [ ] 创建产品页面
- [ ] 填写所有信息
- [ ] 设置发布日期
- [ ] 准备 Maker Comment
- [ ] 找 5-10 个朋友提前通知，发布日来 upvote
