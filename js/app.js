// ===== 人生三万天 - 主应用 v2.0 =====

(function() {
  'use strict';

  const TOTAL_DAYS = 30000;
  const STORAGE_PREFIX = 'life30000_';

  // ===== 状态 =====
  const state = {
    currentUser: null,
    birthday: null,
    lifespan: 80,
    themeColor: '#6366f1',
    reminderEnabled: false,
    isPremium: false,
  };

  // ===== Premium 系统 =====
  const PREMIUM_CONFIG = {
    // 👇 你注册后填入你的链接
    afdian: 'https://afdian.com/a/sherlock1412',    // 爱发电主页
    buymeacoffee: 'https://buymeacoffee.com/sherlock1412',  // Buy Me a Coffee
    // 👇 Premium 激活码（用户捐赠后你发给他们一个码）
    // Activation code hashes - never store plaintext codes in source
    activationCodeHashes: [
      '931e9137'  // SHA-256 derived hash of valid code
    ],
    // Premium 专属主题色
    premiumColors: [
      { color: '#06b6d4', name: '青' },
      { color: '#f97316', name: '橙' },
      { color: '#84cc16', name: '绿' },
      { color: '#e879f9', name: '紫粉' },
      { color: '#14b8a6', name: '碧' },
      { color: '#f43f5e', name: '玫红' },
      { color: '#a855f7', name: '紫' },
      { color: '#eab308', name: '金' },
      { color: '#64748b', name: '灰' },
      { color: '#0ea5e9', name: '天蓝' },
    ],
    // Premium 专属壁纸风格
    premiumStyles: [
      { id: 'aurora', name: '🌌 极光', emoji: '🌌' },
      { id: 'ocean_deep', name: '🌊 深海', emoji: '🌊' },
      { id: 'sakura', name: '🌸 樱花', emoji: '🌸' },
    ],
  };

  function getPremiumStatus() {
    return localStorage.getItem('life30000_premium') === 'true';
  }
  function setPremiumStatus(val) {
    localStorage.setItem('life30000_premium', val ? 'true' : 'false');
    state.isPremium = val;
  }
  function _hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h |= 0;
    }
    return (h >>> 0).toString(16);
  }
  function activatePremium(code) {
    const hashed = _hash(code.toUpperCase());
    if (PREMIUM_CONFIG.activationCodeHashes.includes(hashed)) {
      setPremiumStatus(true);
      return { success: true, message: '🎉 Premium 已激活！感谢你的支持！' };
    }
    return { success: false, message: '激活码无效，请检查后重试' };
  }
  function checkPremiumFeature(featureName) {
    if (state.isPremium) return true;
    showToast(`🔒 ${featureName} 是 Premium 功能，捐赠后即可解锁`);
    showModal('support-modal');
    return false;
  }

  // 实例
  const whiteNoise = new WhiteNoisePlayer();
  const journal = new GratitudeJournal();
  const meditation = new MeditationTimer();
  const challenges = new ChallengeSystem();
  const achievements = new AchievementSystem();
  const report = new LifeReport();

  // ========== 粒子背景 ==========
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) { this.x -= dx * 0.01; this.y -= dy * 0.01; }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ========== 存储 ==========
  function storage(key, value) {
    const fullKey = STORAGE_PREFIX + key;
    if (value === undefined) {
      const raw = localStorage.getItem(fullKey);
      try { return JSON.parse(raw); } catch { return raw; }
    }
    localStorage.setItem(fullKey, JSON.stringify(value));
  }
  function removeStorage(key) { localStorage.removeItem(STORAGE_PREFIX + key); }
  function getUsers() { return storage('users') || {}; }
  function saveUsers(users) { storage('users', users); }

  // ========== 用户系统 ==========
  function register(username, password) {
    const users = getUsers();
    if (users[username]) return { success: false, message: '用户名已存在' };
    users[username] = { password: btoa(password), birthday: null, lifespan: 80 };
    saveUsers(users);
    return { success: true };
  }

  function login(username, password) {
    const users = getUsers();
    const user = users[username];
    if (!user) return { success: false, message: '用户不存在' };
    if (atob(user.password) !== password) return { success: false, message: '密码错误' };
    state.currentUser = username;
    state.birthday = user.birthday;
    state.lifespan = user.lifespan || 80;
    storage('currentUser', username);
    return { success: true };
  }

  function logout() {
    state.currentUser = null;
    whiteNoise.stopAll();
    meditation.stop();
    removeStorage('currentUser');
    showPage('login-page');
  }

  // ========== 页面管理 ==========
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  }
  function showModal(modalId) { document.getElementById(modalId).classList.add('active'); }
  function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }
  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function showAchievementToast(ach) {
    const el = document.getElementById('achievement-toast');
    document.getElementById('ach-toast-icon').textContent = ach.emoji;
    document.getElementById('ach-toast-name').textContent = ach.title;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 3500);
  }

  // ========== 生命计算 ==========
  function calculateLife(birthday) {
    const birth = new Date(birthday);
    const today = new Date();
    today.setHours(0,0,0,0);
    birth.setHours(0,0,0,0);
    const daysLived = Math.floor((today - birth) / 86400000);
    const totalDays = state.lifespan * 365.25;
    const daysRemaining = Math.max(0, Math.floor(totalDays - daysLived));
    const yearsOld = (daysLived / 365.25).toFixed(1);
    const percentLived = Math.min(100, ((daysLived / totalDays) * 100)).toFixed(1);
    return { daysLived, daysRemaining, yearsOld, percentLived, totalDays: Math.floor(totalDays) };
  }

  // ========== 更新主页面 ==========
  function updateMainPage() {
    if (!state.birthday) { showPage('birthday-page'); return; }
    showPage('main-page');
    const life = calculateLife(state.birthday);

    // 日期
    const today = new Date();
    const weekDays = ['日','一','二','三','四','五','六'];
    document.getElementById('today-date').textContent =
      `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
    document.getElementById('today-day-num').textContent =
      `今年的第 ${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)} 天`;

    // 数字动画
    animateNumber('days-lived', life.daysLived);
    animateNumber('days-remaining', life.daysRemaining);
    document.getElementById('years-lived').textContent = life.yearsOld;
    document.getElementById('percent-lived').textContent = life.percentLived + '%';

    // 进度环
    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (life.percentLived / 100) * circumference;
    if (!document.getElementById('progress-gradient')) {
      const svg = circle.closest('svg');
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `<linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${state.themeColor}"/>
        <stop offset="100%" style="stop-color:#ec4899"/>
      </linearGradient>`;
      svg.insertBefore(defs, svg.firstChild);
    }
    circle.style.strokeDasharray = circumference;
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);

    // 金句
    updateQuote();
    // 时间线
    updateTimeline(life);
    // 里程碑
    updateMilestones(life);
    // 趣味数据
    updateFunStats(life);
    // 年度进度环
    updateYearRing();
    // 每日小确幸
    updateJoyCard();

    // 检查成就
    recordVisit();
    const wallpaperCount = parseInt(localStorage.getItem('life30000_wallpaper_count') || '0');
    const quoteCopies = parseInt(localStorage.getItem('life30000_quote_copies') || '0');
    const noisePlay = parseInt(localStorage.getItem('life30000_noise_play') || '0');
    const noiseMix = parseInt(localStorage.getItem('life30000_noise_mix') || '0');
    const newAch = achievements.check(state.birthday, state.lifespan, {
      wallpapersGenerated: wallpaperCount,
      quotesCopied: quoteCopies,
      noisePlayCount: noisePlay,
      maxNoiseMix: noiseMix,
    });
    if (newAch.length > 0) {
      setTimeout(() => showAchievementToast(newAch[0]), 1000);
    }
  }

  function animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    const start = parseInt(el.textContent.replace(/,/g,'')) || 0;
    const duration = 1500, startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ========== 金句 ==========
  let currentQuote = null;
  function updateQuote() {
    currentQuote = getDailyQuote();
    document.getElementById('quote-text').textContent = currentQuote.text;
    document.getElementById('quote-author').textContent = `— ${currentQuote.author}`;
    const loginQuote = getDailyQuote();
    document.getElementById('login-quote').textContent = `"${loginQuote.text}" — ${loginQuote.author}`;
  }
  function refreshQuote() {
    currentQuote = getRandomQuote();
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    textEl.style.opacity = 0; authorEl.style.opacity = 0;
    setTimeout(() => {
      textEl.textContent = currentQuote.text;
      authorEl.textContent = `— ${currentQuote.author}`;
      textEl.style.opacity = 1; authorEl.style.opacity = 1;
    }, 300);
  }

  // ========== 时间线 ==========
  function updateTimeline(life) {
    const grid = document.getElementById('timeline-grid');
    grid.innerHTML = '';
    const livedYears = parseFloat(life.yearsOld);
    for (let i = 0; i < Math.min(state.lifespan, 80); i++) {
      const dot = document.createElement('div');
      dot.className = 'timeline-day';
      if (i < Math.floor(livedYears)) dot.classList.add('lived');
      else if (i === Math.floor(livedYears)) dot.classList.add('today');
      else dot.classList.add('future');
      dot.title = `${i} 岁`;
      grid.appendChild(dot);
    }
  }

  // ========== 里程碑 ==========
  function updateMilestones(life) {
    const milestones = [
      {icon:'👶',name:'出生',years:0},{icon:'🎓',name:'上学',years:6},
      {icon:'📚',name:'初中',years:12},{icon:'🎒',name:'高中',years:15},
      {icon:'🎓',name:'大学毕业',years:22},{icon:'💼',name:'工作',years:23},
      {icon:'💑',name:'三十而立',years:30},{icon:'🏠',name:'四十不惑',years:40},
      {icon:'👨‍👩‍👧',name:'五十知天命',years:50},{icon:'🏖️',name:'退休',years:60},
      {icon:'👴',name:'古稀之年',years:70},{icon:'🎊',name:'耄耋之年',years:80},
    ];
    const list = document.getElementById('milestone-list');
    list.innerHTML = '';
    const age = parseFloat(life.yearsOld);
    milestones.forEach(m => {
      const birthDate = new Date(state.birthday);
      const md = new Date(birthDate);
      md.setFullYear(birthDate.getFullYear() + m.years);
      let status, statusClass;
      if (age >= m.years) { status = '已过'; statusClass = 'passed'; }
      else if (age >= m.years - 1) { status = '即将到来'; statusClass = 'current'; }
      else { status = `还有 ${(m.years - age).toFixed(0)} 年`; statusClass = 'upcoming'; }
      const item = document.createElement('div');
      item.className = 'milestone-item';
      item.innerHTML = `<div class="milestone-icon">${m.icon}</div>
        <div class="milestone-info"><div class="milestone-name">${m.name}</div>
        <div class="milestone-detail">${md.getFullYear()}年 · ${m.years}岁</div></div>
        <span class="milestone-status ${statusClass}">${status}</span>`;
      list.appendChild(item);
    });
  }

  // ========== 趣味数据 ==========
  function updateFunStats(life) {
    const days = life.daysLived;
    const grid = document.getElementById('fun-grid');
    grid.innerHTML = '';
    const stats = [
      {emoji:'💓',value:(days*24*60*72).toLocaleString(),label:'心跳次数'},
      {emoji:'😴',value:(days*8).toLocaleString()+'h',label:'睡眠时间'},
      {emoji:'🍚',value:(days*3).toLocaleString(),label:'吃的饭'},
      {emoji:'🚶',value:(days*5000).toLocaleString()+'步',label:'走的步数'},
      {emoji:'😊',value:(days*15).toLocaleString(),label:'笑的次数'},
      {emoji:'💨',value:(days*20000).toLocaleString()+'次',label:'呼吸次数'},
      {emoji:'📖',value:Math.floor(days/30).toLocaleString()+'本',label:'能读的书'},
      {emoji:'🎬',value:(days*2).toLocaleString()+'部',label:'能看的电影'},
    ];
    stats.forEach(s => {
      const item = document.createElement('div');
      item.className = 'fun-item';
      item.innerHTML = `<div class="fun-emoji">${s.emoji}</div><div class="fun-value">${s.value}</div><div class="fun-label">${s.label}</div>`;
      grid.appendChild(item);
    });
  }

  // ========== 年度进度环 ==========
  function updateYearRing() {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear() + 1, 0, 1);
    const daysThisYear = Math.floor((now - yearStart) / 86400000) + 1;
    const totalDaysInYear = Math.floor((yearEnd - yearStart) / 86400000);
    const percent = ((daysThisYear / totalDaysInYear) * 100).toFixed(1);
    const daysLeft = totalDaysInYear - daysThisYear;
    const weeksPassed = Math.floor(daysThisYear / 7);

    document.getElementById('year-percent').textContent = percent + '%';
    document.getElementById('year-days-passed').textContent = daysThisYear;
    document.getElementById('year-days-left').textContent = daysLeft;
    document.getElementById('year-weeks').textContent = weeksPassed;

    // 更新环形进度
    const circle = document.getElementById('year-progress-circle');
    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (parseFloat(percent) / 100) * circumference;
    circle.style.strokeDasharray = circumference;
    setTimeout(() => { circle.style.strokeDashoffset = offset; }, 300);
  }

  // ========== 每日小确幸 ==========
  const DAILY_JOYS = [
    { emoji: '☀️', text: '今天出门前，抬头看看天空，感受阳光洒在脸上的一刻' },
    { emoji: '🍵', text: '给自己泡一杯喜欢的茶或咖啡，慢慢品味第一口' },
    { emoji: '📖', text: '读10页书，不需要读完一章，享受阅读的过程' },
    { emoji: '🎵', text: '听一首让你开心的歌，可以跟着哼唱或轻声唱出来' },
    { emoji: '🌿', text: '找一株植物认真观察一分钟，看看它的颜色和纹理' },
    { emoji: '💬', text: '给一个你很久没联系的朋友发条消息，简单问声好' },
    { emoji: '📸', text: '拍一张今天让你觉得好看的照片，不需要多完美' },
    { emoji: '🧘', text: '做3分钟深呼吸，闭上眼睛，感受一呼一吸' },
    { emoji: '🍎', text: '慢慢吃一个水果，感受它的味道、质地和香气' },
    { emoji: '📝', text: '写下3件今天让你感恩的小事，再小的事也算' },
    { emoji: '🌙', text: '今晚睡前不看手机，安静地躺5分钟' },
    { emoji: '🤗', text: '今天给自己一个拥抱，或者抱抱你爱的人/宠物' },
    { emoji: '🚶', text: '出门散步15分钟，不需要目的地，随意走走' },
    { emoji: '🌸', text: '留意窗外的一棵树或一朵花，看看今天它有什么不同' },
    { emoji: '😊', text: '对镜子里的自己微笑10秒钟，说一句"你很棒"' },
    { emoji: '🧹', text: '整理一个小角落，不需要大扫除，一个抽屉就好' },
    { emoji: '💧', text: '今天好好喝水，每个小时提醒自己喝一杯' },
    { emoji: '🎭', text: '给家人或朋友讲一个你今天遇到的有趣的事' },
    { emoji: '🕯️', text: '点一支蜡烛（或开一盏暖色灯），安静地坐10分钟' },
    { emoji: '🎨', text: '随手涂鸦5分钟，不需要画得多好，释放创造力' },
    { emoji: '🌈', text: '出门找3种不同颜色的东西，认真观察它们' },
    { emoji: '💤', text: '允许自己什么都不做，只是发呆10分钟' },
    { emoji: '🎁', text: '给自己买一个小东西，不需要贵，让自己开心就好' },
    { emoji: '🎶', text: '闭上眼睛，听3分钟大自然的声音（或白噪音）' },
    { emoji: '✍️', text: '写一段话给一年后的自己，说说现在的心情' },
    { emoji: '🐱', text: '和家里的宠物玩10分钟，或在网上看可爱的动物' },
    { emoji: '🌾', text: '吃一顿不看手机的饭，认真品尝每一口' },
    { emoji: '🌻', text: '对一个服务人员说声真诚的"谢谢"，看着对方的眼睛' },
  ];

  let currentJoyIndex = 0;
  function getDailyJoy() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    currentJoyIndex = dayOfYear % DAILY_JOYS.length;
    return DAILY_JOYS[currentJoyIndex];
  }

  function updateJoyCard() {
    const joy = getDailyJoy();
    document.getElementById('joy-reminder').innerHTML = `<span style="font-size:1.5rem;margin-right:12px">${joy.emoji}</span>${joy.text}`;

    // 检查今天是否已完成
    const joyData = getJoyData();
    const today = getTodayKey();
    const isDone = joyData[today] && joyData[today].done;
    const doneBtn = document.getElementById('joy-done');
    if (isDone) {
      doneBtn.textContent = '✅ 今天已完成';
      doneBtn.disabled = true;
      doneBtn.style.opacity = '0.6';
    } else {
      doneBtn.textContent = '✅ 今天做到了';
      doneBtn.disabled = false;
      doneBtn.style.opacity = '1';
    }

    // 显示连续天数
    const streak = getJoyStreak();
    const info = document.getElementById('joy-streak-info');
    if (streak > 0) {
      info.textContent = `🔥 已连续 ${streak} 天践行小确幸`;
    } else {
      info.textContent = '点击「今天做到了」开始你的小确幸之旅 ✨';
    }
  }

  function refreshJoy() {
    currentJoyIndex = (currentJoyIndex + 1) % DAILY_JOYS.length;
    const joy = DAILY_JOYS[currentJoyIndex];
    const el = document.getElementById('joy-reminder');
    el.style.opacity = '0';
    setTimeout(() => {
      el.innerHTML = `<span style="font-size:1.5rem;margin-right:12px">${joy.emoji}</span>${joy.text}`;
      el.style.opacity = '1';
    }, 300);
  }

  function completeJoy() {
    const joyData = getJoyData();
    const today = getTodayKey();
    joyData[today] = { done: true, completedAt: new Date().toISOString() };
    saveJoyData(joyData);
    updateJoyCard();
    showToast('🌸 今天的美好已记录，真棒！');
    checkAchievements();
  }

  function getJoyData() {
    try { return JSON.parse(localStorage.getItem('life30000_joy')) || {}; } catch { return {}; }
  }
  function saveJoyData(data) { localStorage.setItem('life30000_joy', JSON.stringify(data)); }
  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
  function getJoyStreak() {
    const all = getJoyData();
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (all[key] && all[key].done) { streak++; }
      else if (i > 0) { break; }
    }
    return streak;
  }

  // ========== 白噪音 ==========
  function initNoisePlayer() {
    const grid = document.getElementById('noise-grid');
    grid.innerHTML = '';
    SOUNDS_DATA.forEach(sound => {
      const item = document.createElement('div');
      item.className = 'noise-item';
      item.innerHTML = `<span class="noise-emoji">${sound.emoji}</span>
        <span class="noise-name">${sound.name}</span>
        <input type="range" class="noise-volume" min="0" max="100" value="50">`;
      item.addEventListener('click', e => {
        if (e.target.classList.contains('noise-volume')) return;
        if (whiteNoise.isPlaying(sound.id)) {
          whiteNoise.stop(sound.id);
          item.classList.remove('active');
        } else {
          whiteNoise.play(sound);
          item.classList.add('active');
        }
        updateNoiseCount();
        recordNoise(whiteNoise.getActiveCount());
      });
      const slider = item.querySelector('.noise-volume');
      slider.addEventListener('input', e => {
        whiteNoise.setVolume(sound.id, e.target.value / 100);
      });
      grid.appendChild(item);
    });
    updateNoiseCount();
  }

  function updateNoiseCount() {
    document.getElementById('noise-active-count').textContent = whiteNoise.getActiveCount();
  }

  // ========== 感恩日记 ==========
  function initGratitude() {
    const entries = journal.getToday();
    for (let i = 0; i < 3; i++) {
      document.getElementById(`grat-${i}`).value = entries[i] || '';
    }
    document.getElementById('grat-streak').textContent = journal.getStreak();
    document.getElementById('grat-total').textContent = journal.getTotalEntries();
    document.getElementById('gratitude-prompt').textContent = '💡 ' + journal.getRandomPrompt();
  }

  function saveGratitude() {
    const entries = [];
    for (let i = 0; i < 3; i++) {
      entries.push(document.getElementById(`grat-${i}`).value);
    }
    journal.saveToday(entries);
    document.getElementById('grat-streak').textContent = journal.getStreak();
    document.getElementById('grat-total').textContent = journal.getTotalEntries();
    showToast('感恩日记已保存 💚');
    checkAchievements();
  }

  // ========== 冥想 ==========
  function initMeditation() {
    const stats = meditation.getStats();
    document.getElementById('med-sessions').textContent = stats.sessions;
    document.getElementById('med-total-min').textContent = Math.floor(stats.totalSeconds / 60);
    document.getElementById('med-time').textContent = '05:00';
    document.getElementById('med-progress').style.strokeDashoffset = '0';
    
    document.querySelectorAll('.med-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        if (meditation.isRunning) return;
        document.querySelectorAll('.med-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const min = parseInt(btn.dataset.minutes);
        document.getElementById('med-time').textContent = `${String(min).padStart(2,'0')}:00`;
      });
    });
  }

  function startMeditation() {
    const activePreset = document.querySelector('.med-preset.active');
    const minutes = parseInt(activePreset.dataset.minutes);
    
    document.getElementById('med-start').classList.add('hidden');
    document.getElementById('med-pause').classList.remove('hidden');
    document.getElementById('med-stop').classList.remove('hidden');
    document.querySelectorAll('.med-preset').forEach(b => b.style.pointerEvents = 'none');

    meditation.start(minutes, (remaining, total) => {
      document.getElementById('med-time').textContent = meditation.formatTime(remaining);
      const circumference = 2 * Math.PI * 90;
      const offset = circumference * (1 - remaining / total);
      document.getElementById('med-progress').style.strokeDashoffset = offset;
    }, () => {
      completeMeditation();
    });
  }

  function pauseMeditation() {
    const paused = meditation.pause();
    document.getElementById('med-pause').textContent = paused ? '继续' : '暂停';
  }

  function stopMeditation() {
    meditation.stop();
    resetMeditationUI();
  }

  function completeMeditation() {
    resetMeditationUI();
    const stats = meditation.getStats();
    document.getElementById('med-sessions').textContent = stats.sessions;
    document.getElementById('med-total-min').textContent = Math.floor(stats.totalSeconds / 60);
    showToast('🧘 冥想完成！感受内心的宁静');
    checkAchievements();
  }

  function resetMeditationUI() {
    document.getElementById('med-start').classList.remove('hidden');
    document.getElementById('med-pause').classList.add('hidden');
    document.getElementById('med-stop').classList.add('hidden');
    document.getElementById('med-pause').textContent = '暂停';
    document.querySelectorAll('.med-preset').forEach(b => b.style.pointerEvents = 'auto');
    const activePreset = document.querySelector('.med-preset.active');
    const minutes = parseInt(activePreset.dataset.minutes);
    document.getElementById('med-time').textContent = `${String(minutes).padStart(2,'0')}:00`;
    document.getElementById('med-progress').style.strokeDashoffset = '0';
  }

  // ========== 年度报告 ==========
  function showReport() {
    const data = report.generate(state.birthday, state.lifespan);
    const container = document.getElementById('report-content');
    container.innerHTML = `
      <div class="report-stage">
        <div class="report-stage-label">当前生命阶段</div>
        <div class="report-stage-value">${data.lifeStage}</div>
      </div>

      <div class="report-section">
        <div class="report-section-title">🌍 生命概览</div>
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat-value">${data.yearsOld}</div><div class="report-stat-label">岁</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.daysLived.toLocaleString()}</div><div class="report-stat-label">天已过</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.daysRemaining.toLocaleString()}</div><div class="report-stat-label">天剩余</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.monthsLived.toLocaleString()}</div><div class="report-stat-label">个月</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.weeksLived.toLocaleString()}</div><div class="report-stat-label">周</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.dayOfYear}</div><div class="report-stat-label">今年第N天</div></div>
        </div>
        <div class="report-bar"><div class="report-bar-fill" style="width:${((data.daysLived/data.totalDays)*100).toFixed(1)}%"></div></div>
      </div>

      <div class="report-section">
        <div class="report-section-title">💓 生命中的数字</div>
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat-value">${(data.heartbeats/1000000).toFixed(1)}M</div><div class="report-stat-label">心跳</div></div>
          <div class="report-stat"><div class="report-stat-value">${(data.breaths/1000000).toFixed(1)}M</div><div class="report-stat-label">次呼吸</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.sleepHours.toLocaleString()}</div><div class="report-stat-label">小时睡眠</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.meals.toLocaleString()}</div><div class="report-stat-label">顿饭</div></div>
          <div class="report-stat"><div class="report-stat-value">${(data.steps/1000000).toFixed(1)}M</div><div class="report-stat-label">步</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.daysUntilBirthday}</div><div class="report-stat-label">天后生日</div></div>
        </div>
      </div>

      <div class="report-section">
        <div class="report-section-title">📅 今年进度</div>
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat-value">${data.daysThisYear}</div><div class="report-stat-label">天已过</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.yearProgress}%</div><div class="report-stat-label">年度进度</div></div>
        </div>
        <div class="report-bar"><div class="report-bar-fill" style="width:${data.yearProgress}%"></div></div>
      </div>

      <div class="report-section">
        <div class="report-section-title">🎯 应用数据</div>
        <div class="report-grid">
          <div class="report-stat"><div class="report-stat-value">${data.totalGratitude}</div><div class="report-stat-label">条感恩</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.gratitudeStreak}</div><div class="report-stat-label">天连续感恩</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.meditationSessions}</div><div class="report-stat-label">次冥想</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.meditationMinutes}</div><div class="report-stat-label">分钟冥想</div></div>
          <div class="report-stat"><div class="report-stat-value">${data.achievementsUnlocked}/${data.totalAchievements}</div><div class="report-stat-label">成就解锁</div></div>
        </div>
      </div>
    `;
    showModal('report-modal');
  }

  // ========== 每日挑战 ==========
  function initChallenge() {
    const challenge = challenges.getTodayChallenge();
    const stats = challenges.getStats();
    
    document.getElementById('ch-emoji').textContent = challenge.emoji;
    document.getElementById('ch-title').textContent = challenge.title;
    document.getElementById('ch-desc').textContent = challenge.desc;
    document.getElementById('ch-category').textContent = challenge.category;
    document.getElementById('ch-streak').textContent = stats.streak;
    document.getElementById('ch-completed').textContent = stats.completed;
    
    const card = document.getElementById('challenge-card');
    if (challenge.completed) {
      card.classList.add('completed');
      document.getElementById('ch-complete').textContent = '✅ 已完成';
      document.getElementById('ch-complete').disabled = true;
    } else {
      card.classList.remove('completed');
      document.getElementById('ch-complete').textContent = '✅ 完成挑战';
      document.getElementById('ch-complete').disabled = false;
    }
  }

  function completeChallenge() {
    challenges.completeToday();
    initChallenge();
    showToast('🎉 挑战完成！');
    checkAchievements();
  }

  function refreshChallenge() {
    challenges.getNewChallenge();
    initChallenge();
  }

  // ========== 成就系统 ==========
  function checkAchievements() {
    const wallpaperCount = parseInt(localStorage.getItem('life30000_wallpaper_count') || '0');
    const quoteCopies = parseInt(localStorage.getItem('life30000_quote_copies') || '0');
    const noisePlay = parseInt(localStorage.getItem('life30000_noise_play') || '0');
    const noiseMix = parseInt(localStorage.getItem('life30000_noise_mix') || '0');
    const newAch = achievements.check(state.birthday, state.lifespan, {
      wallpapersGenerated: wallpaperCount,
      quotesCopied: quoteCopies,
      noisePlayCount: noisePlay,
      maxNoiseMix: noiseMix,
    });
    if (newAch.length > 0) {
      setTimeout(() => showAchievementToast(newAch[0]), 500);
    }
  }

  function showAchievements() {
    const all = achievements.getAll();
    const unlocked = achievements.getUnlocked();
    
    document.getElementById('ach-unlocked-count').textContent = unlocked.length;
    document.getElementById('ach-total-count').textContent = all.length;
    document.getElementById('ach-progress-fill').style.width = ((unlocked.length / all.length) * 100) + '%';
    
    const grid = document.getElementById('achievements-grid');
    grid.innerHTML = '';
    all.forEach(ach => {
      const isUnlocked = unlocked.includes(ach.id);
      const item = document.createElement('div');
      item.className = `achievement-item ${isUnlocked ? '' : 'locked'}`;
      item.innerHTML = `<div class="achievement-emoji">${ach.emoji}</div>
        <div class="achievement-title">${ach.title}</div>
        <div class="achievement-desc">${ach.desc}</div>`;
      grid.appendChild(item);
    });
    showModal('achievements-modal');
  }

  // ========== 壁纸生成器 ==========
  let wallpaperGen = null;
  function initWallpaperGenerator() {
    const canvas = document.getElementById('wallpaper-canvas');
    wallpaperGen = new WallpaperGenerator(canvas);
    const life = calculateLife(state.birthday);
    const quote = getDailyQuote();
    wallpaperGen.setData({
      daysRemaining: life.daysRemaining,
      daysLived: life.daysLived,
      percentLived: parseFloat(life.percentLived),
      quote: quote.text,
    });
    wallpaperGen.setSize(1080, 1920);
    wallpaperGen.generate();
  }

  // ========== 解压工具 ==========
  let breathingExercise = null;
  let bubbleGame = null;

  function initTipsContent() {
    showTipsCategory('breathing');
    document.querySelectorAll('.tips-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tips-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        showTipsCategory(tab.dataset.category);
      });
    });
  }

  function showTipsCategory(category) {
    const content = document.getElementById('tips-content');
    if (breathingExercise) breathingExercise.stop();
    if (bubbleGame) bubbleGame.stop();

    if (category === 'breathing') {
      content.innerHTML = `<div class="breathing-container">
        <h4>${TIPS_DATA.breathing.title}</h4>
        <p style="color:var(--text-secondary);margin:8px 0 16px">${TIPS_DATA.breathing.description}</p>
        <div class="breath-circle" id="breath-circle">点击开始</div>
        <div class="breath-controls" id="breath-controls">
          ${TIPS_DATA.breathing.exercises.map((ex,i)=>`<button class="breath-btn ${i===0?'active':''}" data-inhale="${ex.inhale}" data-hold="${ex.hold}" data-exhale="${ex.exhale}">${ex.name}</button>`).join('')}
        </div>
        <p style="color:var(--text-muted);margin-top:12px;font-size:0.85rem" id="breath-desc">${TIPS_DATA.breathing.exercises[0].desc}</p>
      </div>`;
      const circle = document.getElementById('breath-circle');
      breathingExercise = new BreathingExercise(circle);
      circle.addEventListener('click', () => {
        if (breathingExercise.isRunning) { breathingExercise.stop(); }
        else {
          const btn = document.querySelector('.breath-btn.active');
          breathingExercise.start(parseInt(btn.dataset.inhale), parseInt(btn.dataset.hold), parseInt(btn.dataset.exhale));
        }
      });
      document.querySelectorAll('.breath-btn').forEach((btn,i) => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.breath-btn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          document.getElementById('breath-desc').textContent = TIPS_DATA.breathing.exercises[i].desc;
          if (breathingExercise.isRunning) {
            breathingExercise.stop();
            breathingExercise.start(parseInt(btn.dataset.inhale), parseInt(btn.dataset.hold), parseInt(btn.dataset.exhale));
          }
        });
      });
    } else if (category === 'game') {
      content.innerHTML = `<div class="game-container">
        <h4>🫧 泡泡解压</h4><p style="color:var(--text-secondary);margin:8px 0 16px">点击泡泡释放压力！</p>
        <div class="game-area"><div class="bubble-area" id="bubble-area"></div>
        <div class="game-score">得分：0</div>
        <button class="game-btn" id="game-start-btn">开始游戏</button></div></div>`;
      bubbleGame = new BubbleGame(document.getElementById('bubble-area'));
      document.getElementById('game-start-btn').addEventListener('click', function() {
        if (bubbleGame.isPlaying) { bubbleGame.stop(); this.textContent='开始游戏'; }
        else { bubbleGame.start(); this.textContent='停止'; }
      });
    } else if (category === 'tips') {
      content.innerHTML = `<div class="tips-list">${TIPS_DATA.tips.items.map(t=>`<div class="tip-card">
        <div class="tip-card-title">${t.emoji} ${t.title}</div>
        <div class="tip-card-desc">${t.desc}</div></div>`).join('')}</div>`;
    } else if (category === 'quotes') {
      const quotesContainer = document.createElement('div');
      quotesContainer.className = 'tips-list';
      TIPS_DATA.quotes.items.forEach(q => {
        const card = document.createElement('div');
        card.className = 'tip-card';
        card.style.cursor = 'pointer';
        const titleEl = document.createElement('div');
        titleEl.className = 'tip-card-title';
        titleEl.textContent = q.emoji;
        const descEl = document.createElement('div');
        descEl.className = 'tip-card-desc';
        descEl.style.cssText = 'font-size:1.05rem;line-height:1.8';
        descEl.textContent = q.text;
        card.appendChild(titleEl);
        card.appendChild(descEl);
        card.addEventListener('click', () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(q.text).then(() => showToast('已复制！'));
          }
        });
        quotesContainer.appendChild(card);
      });
      content.innerHTML = '';
      content.appendChild(quotesContainer);
    }
  }

  // ========== 小组件预览 ==========
  function initWidgetPreview() {
    const container = document.getElementById('widget-previews');
    const life = calculateLife(state.birthday);
    const quote = getDailyQuote();
    container.innerHTML = `
      <div class="widget-preview-item"><h4>小组件 (小)</h4><div class="widget-render">
        <div class="widget-mini"><div class="widget-mini-header"><span>🌅 人生三万天</span><span>${new Date().getMonth()+1}/${new Date().getDate()}</span></div>
        <div><div class="widget-mini-days">${life.daysRemaining.toLocaleString()}</div><div class="widget-mini-label">天剩余</div></div>
        <div class="widget-mini-progress"><div class="widget-mini-progress-fill" style="width:${life.percentLived}%"></div></div></div></div>
        <div class="widget-actions"><button class="widget-action-btn" onclick="showToast('截图保存即可！')">📸 截图</button></div></div>
      <div class="widget-preview-item"><h4>小组件 (中)</h4><div class="widget-render" style="overflow-x:auto">
        <div class="widget-medium"><div class="widget-medium-ring"><svg width="120" height="120" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#wg)" stroke-width="8" stroke-linecap="round"
            stroke-dasharray="${2*Math.PI*90}" stroke-dashoffset="${2*Math.PI*90*(1-life.percentLived/100)}" transform="rotate(-90 100 100)"/>
          <defs><linearGradient id="wg"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
          <text x="100" y="95" text-anchor="middle" fill="white" font-size="36" font-weight="900">${life.daysRemaining.toLocaleString()}</text>
          <text x="100" y="120" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="14">天</text></svg></div>
          <div class="widget-medium-info"><div class="widget-medium-title">🌅 人生三万天 · ${new Date().toLocaleDateString('zh-CN')}</div>
          <div class="widget-medium-quote">"${quote.text.substring(0,40)}${quote.text.length>40?'...':''}"</div>
          <div class="widget-medium-stats"><div class="widget-mini-stat"><strong>${life.yearsOld}</strong>岁</div>
          <div class="widget-mini-stat"><strong>${life.daysLived.toLocaleString()}</strong>天已过</div>
          <div class="widget-mini-stat"><strong>${life.percentLived}%</strong>已度过</div></div></div></div></div></div>
      <div class="widget-preview-item"><h4>嵌入代码</h4>
        <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;font-size:0.8rem;color:var(--text-secondary);overflow-x:auto">
        <code>&lt;iframe src="${window.location.origin}/widget/widget.html" width="170" height="170" frameborder="0"&gt;&lt;/iframe&gt;</code></div>
        <div class="widget-actions" style="margin-top:8px"><button class="widget-action-btn" onclick="navigator.clipboard.writeText('<iframe src=\\''+window.location.origin+'/widget/widget.html\\' width=\\'170\\' height=\\'170\\' frameborder=\\'0\\'></iframe>');showToast('已复制！')">复制代码</button></div></div>`;
  }

  // ========== 设置 ==========
  function initSettings() {
    document.getElementById('settings-birthday').value = state.birthday || '';
    document.getElementById('settings-lifespan').value = state.lifespan;
    document.getElementById('lifespan-value').textContent = state.lifespan + ' 岁';
    document.getElementById('settings-reminder').checked = state.reminderEnabled;
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === state.themeColor);
    });

    // Premium 状态
    state.isPremium = getPremiumStatus();
    const statusText = document.getElementById('premium-status-text');
    const activateRow = document.getElementById('premium-activate-row');
    const premiumColorsDiv = document.getElementById('premium-colors');

    if (state.isPremium) {
      statusText.innerHTML = '<span class="premium-badge">✨ Premium 已激活</span>';
      activateRow.style.display = 'none';
      premiumColorsDiv.style.display = 'block';
      // 渲染 Premium 专属色
      const grid = document.getElementById('premium-color-grid');
      grid.innerHTML = '';
      PREMIUM_CONFIG.premiumColors.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.dataset.color = c.color;
        btn.style.background = c.color;
        btn.title = c.name;
        if (state.themeColor === c.color) btn.classList.add('active');
        grid.appendChild(btn);
      });
    } else {
      statusText.textContent = '捐赠后获得激活码，解锁 Premium 功能';
      activateRow.style.display = 'flex';
      premiumColorsDiv.style.display = 'none';
    }
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    // 登录/注册切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const isLogin = btn.dataset.tab === 'login';
        document.getElementById('login-form').classList.toggle('hidden', !isLogin);
        document.getElementById('register-form').classList.toggle('hidden', isLogin);
      });
    });

    // 登录
    document.getElementById('login-form').addEventListener('submit', e => {
      e.preventDefault();
      const result = login(
        document.getElementById('login-username').value.trim(),
        document.getElementById('login-password').value
      );
      if (result.success) { state.birthday ? updateMainPage() : showPage('birthday-page'); }
      else showToast(result.message);
    });

    // 注册
    document.getElementById('register-form').addEventListener('submit', e => {
      e.preventDefault();
      const pw = document.getElementById('reg-password').value;
      if (pw !== document.getElementById('reg-confirm').value) { showToast('两次密码不一致'); return; }
      if (pw.length < 3) { showToast('密码至少3位'); return; }
      const result = register(document.getElementById('reg-username').value.trim(), pw);
      if (result.success) {
        login(document.getElementById('reg-username').value.trim(), pw);
        showPage('birthday-page'); showToast('注册成功！');
      } else showToast(result.message);
    });

    // 生日
    document.getElementById('start-journey-btn').addEventListener('click', () => {
      const birthday = document.getElementById('birthday-input').value;
      if (!birthday) { showToast('请选择你的生日'); return; }
      if (new Date(birthday) > new Date()) { showToast('生日不能在未来'); return; }
      state.birthday = birthday;
      const users = getUsers();
      if (users[state.currentUser]) { users[state.currentUser].birthday = birthday; saveUsers(users); }
      updateMainPage();
      showToast('欢迎开启你的三万天旅程！✨');
    });

    // 金句
    document.getElementById('refresh-quote').addEventListener('click', refreshQuote);
    document.getElementById('copy-quote').addEventListener('click', () => {
      if (currentQuote) {
        navigator.clipboard.writeText(`"${currentQuote.text}" — ${currentQuote.author}`).then(() => {
          showToast('已复制！');
          recordQuoteCopy();
        });
      }
    });
    document.getElementById('share-quote').addEventListener('click', () => {
      if (currentQuote && navigator.share) {
        navigator.share({ title: '人生三万天 · 每日金句', text: `"${currentQuote.text}" — ${currentQuote.author}` });
      } else showToast('当前浏览器不支持分享');
    });

    // === 白噪音 ===
    document.getElementById('noise-btn').addEventListener('click', () => { initNoisePlayer(); showModal('noise-modal'); });
    document.getElementById('noise-close').addEventListener('click', () => hideModal('noise-modal'));

    // === 感恩日记 ===
    document.getElementById('gratitude-btn').addEventListener('click', () => { initGratitude(); showModal('gratitude-modal'); });
    document.getElementById('gratitude-close').addEventListener('click', () => hideModal('gratitude-modal'));
    document.getElementById('save-gratitude').addEventListener('click', saveGratitude);

    // === 冥想 ===
    document.getElementById('meditation-btn').addEventListener('click', () => { initMeditation(); showModal('meditation-modal'); });
    document.getElementById('meditation-close').addEventListener('click', () => { meditation.stop(); resetMeditationUI(); hideModal('meditation-modal'); });
    document.getElementById('med-start').addEventListener('click', startMeditation);
    document.getElementById('med-pause').addEventListener('click', pauseMeditation);
    document.getElementById('med-stop').addEventListener('click', stopMeditation);

    // === 年度报告 ===
    document.getElementById('report-btn').addEventListener('click', showReport);
    document.getElementById('report-close').addEventListener('click', () => hideModal('report-modal'));

    // === 挑战 ===
    document.getElementById('challenge-btn').addEventListener('click', () => { initChallenge(); showModal('challenge-modal'); });
    document.getElementById('challenge-close').addEventListener('click', () => hideModal('challenge-modal'));
    document.getElementById('ch-complete').addEventListener('click', completeChallenge);
    document.getElementById('ch-refresh').addEventListener('click', refreshChallenge);

    // === 成就 ===
    document.getElementById('achievements-btn').addEventListener('click', showAchievements);
    document.getElementById('achievements-close').addEventListener('click', () => hideModal('achievements-modal'));

    // === 壁纸 ===
    document.getElementById('wallpaper-btn').addEventListener('click', () => { initWallpaperGenerator(); showModal('wallpaper-modal'); });
    document.getElementById('wallpaper-close').addEventListener('click', () => hideModal('wallpaper-modal'));
    document.querySelectorAll('.style-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        wallpaperGen.setStyle(btn.dataset.style);
        wallpaperGen.generate();
      });
    });
    document.getElementById('wallpaper-size').addEventListener('change', e => {
      const [w,h] = e.target.value.split('x').map(Number);
      wallpaperGen.setSize(w, h);
      wallpaperGen.generate();
    });
    document.getElementById('download-wallpaper').addEventListener('click', () => {
      wallpaperGen.download(`life-30000-days-${Date.now()}.png`);
      recordWallpaper();
      showToast('壁纸已保存！');
      checkAchievements();
    });

    // === 解压贴士 ===
    document.getElementById('tips-btn').addEventListener('click', () => { initTipsContent(); showModal('tips-modal'); });
    document.getElementById('tips-close').addEventListener('click', () => {
      if (breathingExercise) breathingExercise.stop();
      if (bubbleGame) bubbleGame.stop();
      hideModal('tips-modal');
    });

    // === 每日小确幸 ===
    document.getElementById('joy-refresh').addEventListener('click', refreshJoy);
    document.getElementById('joy-done').addEventListener('click', completeJoy);

    // === 支持/捐赠 ===
    document.getElementById('support-btn').addEventListener('click', () => {
      // 设置链接
      document.getElementById('link-afdian').href = PREMIUM_CONFIG.afdian;
      document.getElementById('link-bmc').href = PREMIUM_CONFIG.buymeacoffee;
      showModal('support-modal');
    });
    document.getElementById('support-close').addEventListener('click', () => hideModal('support-modal'));
    document.querySelectorAll('.support-tier').forEach(tier => {
      tier.addEventListener('click', () => {
        document.querySelectorAll('.support-tier').forEach(t => t.classList.remove('selected'));
        tier.classList.add('selected');
      });
    });

    // === Premium 激活 ===
    document.getElementById('premium-activate-btn').addEventListener('click', () => {
      const code = document.getElementById('premium-code-input').value.trim();
      if (!code) { showToast('请输入激活码'); return; }
      const result = activatePremium(code);
      showToast(result.message);
      if (result.success) {
        document.getElementById('premium-code-input').value = '';
        initSettings();
        // 重新渲染主题色选择器
        const oldGrad = document.getElementById('progress-gradient');
        if (oldGrad) oldGrad.remove();
      }
    });
    // 回车激活
    document.getElementById('premium-code-input').addEventListener('keydown', e => {
      if (e.key === 'Enter') document.getElementById('premium-activate-btn').click();
    });

    // === 小组件 ===
    document.getElementById('widget-btn').addEventListener('click', () => { initWidgetPreview(); showModal('widget-modal'); });
    document.getElementById('widget-close').addEventListener('click', () => hideModal('widget-modal'));

    // === 设置 ===
    document.getElementById('settings-btn').addEventListener('click', () => { initSettings(); showModal('settings-modal'); });
    document.getElementById('settings-close').addEventListener('click', () => hideModal('settings-modal'));
    document.getElementById('settings-lifespan').addEventListener('input', e => {
      document.getElementById('lifespan-value').textContent = e.target.value + ' 岁';
    });
    // 使用事件委托，支持动态生成的 Premium 颜色按钮
    document.getElementById('settings-modal').addEventListener('click', e => {
      const btn = e.target.closest('.color-btn');
      if (!btn) return;
      document.querySelectorAll('#settings-modal .color-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.themeColor = btn.dataset.color;
      document.documentElement.style.setProperty('--primary', state.themeColor);
    });
    document.getElementById('save-settings').addEventListener('click', () => {
      state.birthday = document.getElementById('settings-birthday').value;
      state.lifespan = parseInt(document.getElementById('settings-lifespan').value);
      state.reminderEnabled = document.getElementById('settings-reminder').checked;
      const users = getUsers();
      if (users[state.currentUser]) {
        users[state.currentUser].birthday = state.birthday;
        users[state.currentUser].lifespan = state.lifespan;
        saveUsers(users);
      }
      // 保存主题色
      localStorage.setItem('life30000_themeColor', state.themeColor);
      // 重置进度环渐变
      const oldGrad = document.getElementById('progress-gradient');
      if (oldGrad) oldGrad.remove();
      hideModal('settings-modal');
      updateMainPage();
      showToast('设置已保存！');
    });

    // 登出
    document.getElementById('logout-btn').addEventListener('click', logout);

    // 点击弹窗外部关闭
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          if (breathingExercise) breathingExercise.stop();
          if (bubbleGame) bubbleGame.stop();
          if (modal.id === 'meditation-modal') { meditation.stop(); resetMeditationUI(); }
          if (modal.id === 'noise-modal') whiteNoise.stopAll();
          modal.classList.remove('active');
        }
      });
    });
  }

  // ========== 初始化 ==========
  function init() {
    initParticles();
    bindEvents();
    // 加载 Premium 状态和主题色
    state.isPremium = getPremiumStatus();
    const savedColor = localStorage.getItem('life30000_themeColor');
    if (savedColor) {
      state.themeColor = savedColor;
      document.documentElement.style.setProperty('--primary', savedColor);
    }
    const lastUser = storage('currentUser');
    if (lastUser) {
      const users = getUsers();
      if (users[lastUser]) {
        state.currentUser = lastUser;
        state.birthday = users[lastUser].birthday;
        state.lifespan = users[lastUser].lifespan || 80;
        state.birthday ? updateMainPage() : showPage('birthday-page');
        return;
      }
    }
    const quote = getDailyQuote();
    document.getElementById('login-quote').textContent = `"${quote.text}" — ${quote.author}`;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.showToast = showToast;
})();
