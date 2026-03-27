// ===== 人生三万天 - 主应用 =====

(function() {
  'use strict';

  const TOTAL_DAYS = 30000; // 人生三万天约82岁
  const STORAGE_PREFIX = 'life30000_';

  // ===== 状态管理 =====
  const state = {
    currentUser: null,
    birthday: null,
    lifespan: 80,
    themeColor: '#6366f1',
    reminderEnabled: false,
  };

  // ===== 粒子背景 =====
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

    canvas.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }
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

        // 鼠标交互
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= dx * 0.01;
          this.y -= dy * 0.01;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < 60; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // 连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
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

  // ===== 本地存储 =====
  function storage(key, value) {
    const fullKey = STORAGE_PREFIX + key;
    if (value === undefined) {
      const raw = localStorage.getItem(fullKey);
      try { return JSON.parse(raw); } catch { return raw; }
    }
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  function removeStorage(key) {
    localStorage.removeItem(STORAGE_PREFIX + key);
  }

  // ===== 用户系统 =====
  function getUsers() {
    return storage('users') || {};
  }

  function saveUsers(users) {
    storage('users', users);
  }

  function register(username, password) {
    const users = getUsers();
    if (users[username]) {
      return { success: false, message: '用户名已存在' };
    }
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
    removeStorage('currentUser');
    showPage('login-page');
  }

  function isLoggedIn() {
    return !!state.currentUser;
  }

  // ===== 页面管理 =====
  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
  }

  function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // ===== 生命计算 =====
  function calculateLife(birthday) {
    const birth = new Date(birthday);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    birth.setHours(0, 0, 0, 0);

    const daysLived = Math.floor((today - birth) / 86400000);
    const totalDays = state.lifespan * 365.25;
    const daysRemaining = Math.max(0, Math.floor(totalDays - daysLived));
    const yearsOld = (daysLived / 365.25).toFixed(1);
    const percentLived = Math.min(100, ((daysLived / totalDays) * 100)).toFixed(1);

    return { daysLived, daysRemaining, yearsOld, percentLived, totalDays: Math.floor(totalDays) };
  }

  // ===== 更新主页面 =====
  function updateMainPage() {
    if (!state.birthday) {
      showPage('birthday-page');
      return;
    }

    showPage('main-page');
    const life = calculateLife(state.birthday);

    // 日期
    const today = new Date();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    document.getElementById('today-date').textContent = 
      `${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日 星期${weekDays[today.getDay()]}`;
    document.getElementById('today-day-num').textContent = 
      `今年的第 ${Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000)} 天`;

    // 数字
    animateNumber('days-lived', life.daysLived);
    animateNumber('days-remaining', life.daysRemaining);
    document.getElementById('years-lived').textContent = life.yearsOld;
    document.getElementById('percent-lived').textContent = life.percentLived + '%';

    // 进度环
    const circle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (life.percentLived / 100) * circumference;
    
    // 添加 SVG 渐变
    if (!document.getElementById('progress-gradient')) {
      const svg = circle.closest('svg');
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:${state.themeColor}"/>
          <stop offset="100%" style="stop-color:#ec4899"/>
        </linearGradient>
      `;
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
  }

  function animateNumber(elementId, target) {
    const el = document.getElementById(elementId);
    const start = parseInt(el.textContent.replace(/,/g, '')) || 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== 金句 =====
  let currentQuote = null;

  function updateQuote() {
    currentQuote = getDailyQuote();
    document.getElementById('quote-text').textContent = currentQuote.text;
    document.getElementById('quote-author').textContent = `— ${currentQuote.author}`;
    
    // 登录页金句
    const loginQuote = getDailyQuote();
    document.getElementById('login-quote').textContent = `"${loginQuote.text}" — ${loginQuote.author}`;
  }

  function refreshQuote() {
    currentQuote = getRandomQuote();
    const textEl = document.getElementById('quote-text');
    const authorEl = document.getElementById('quote-author');
    textEl.style.opacity = 0;
    authorEl.style.opacity = 0;
    setTimeout(() => {
      textEl.textContent = currentQuote.text;
      authorEl.textContent = `— ${currentQuote.author}`;
      textEl.style.opacity = 1;
      authorEl.style.opacity = 1;
    }, 300);
  }

  // ===== 时间线 =====
  function updateTimeline(life) {
    const grid = document.getElementById('timeline-grid');
    grid.innerHTML = '';
    
    const totalYears = state.lifespan;
    const livedYears = parseFloat(life.yearsOld);
    // 每一行100个点，代表100年
    const dotsToShow = Math.min(totalYears, 80); // 显示最多80年

    for (let i = 0; i < dotsToShow; i++) {
      const dot = document.createElement('div');
      dot.className = 'timeline-day';
      if (i < Math.floor(livedYears)) {
        dot.classList.add('lived');
      } else if (i === Math.floor(livedYears)) {
        dot.classList.add('today');
      } else {
        dot.classList.add('future');
      }
      dot.title = `${i} 岁`;
      grid.appendChild(dot);
    }
  }

  // ===== 里程碑 =====
  function updateMilestones(life) {
    const milestones = [
      { icon: '👶', name: '出生', years: 0 },
      { icon: '🎓', name: '上学', years: 6 },
      { icon: '📚', name: '初中', years: 12 },
      { icon: '🎒', name: '高中', years: 15 },
      { icon: '🎓', name: '大学毕业', years: 22 },
      { icon: '💼', name: '工作', years: 23 },
      { icon: '💑', name: '三十而立', years: 30 },
      { icon: '🏠', name: '四十不惑', years: 40 },
      { icon: '👨‍👩‍👧', name: '五十知天命', years: 50 },
      { icon: '🏖️', name: '退休', years: 60 },
      { icon: '👴', name: '古稀之年', years: 70 },
      { icon: '🎊', name: '耄耋之年', years: 80 },
    ];

    const list = document.getElementById('milestone-list');
    list.innerHTML = '';
    const age = parseFloat(life.yearsOld);

    milestones.forEach(m => {
      const birthDate = new Date(state.birthday);
      const milestoneDate = new Date(birthDate);
      milestoneDate.setFullYear(birthDate.getFullYear() + m.years);
      
      const item = document.createElement('div');
      item.className = 'milestone-item';
      
      let status, statusClass;
      if (age >= m.years) {
        status = '已过';
        statusClass = 'passed';
      } else if (age >= m.years - 1) {
        status = '即将到来';
        statusClass = 'current';
      } else {
        const yearsLeft = m.years - age;
        status = `还有 ${yearsLeft.toFixed(0)} 年`;
        statusClass = 'upcoming';
      }

      item.innerHTML = `
        <div class="milestone-icon">${m.icon}</div>
        <div class="milestone-info">
          <div class="milestone-name">${m.name}</div>
          <div class="milestone-detail">${milestoneDate.getFullYear()}年 · ${m.years}岁</div>
        </div>
        <span class="milestone-status ${statusClass}">${status}</span>
      `;
      list.appendChild(item);
    });
  }

  // ===== 趣味数据 =====
  function updateFunStats(life) {
    const days = life.daysLived;
    const grid = document.getElementById('fun-grid');
    grid.innerHTML = '';

    const stats = [
      { emoji: '💓', value: (days * 24 * 60 * 72).toLocaleString(), label: '心跳次数 (约)' },
      { emoji: '😴', value: (days * 8).toLocaleString() + 'h', label: '睡眠时间 (约)' },
      { emoji: '🍚', value: (days * 3).toLocaleString(), label: '吃过的饭 (约)' },
      { emoji: '🚶', value: (days * 5000).toLocaleString() + '步', label: '走过的步数 (约)' },
      { emoji: '😊', value: (days * 15).toLocaleString(), label: '笑过的次数 (约)' },
      { emoji: '💨', value: (days * 20000).toLocaleString() + '次', label: '呼吸次数 (约)' },
      { emoji: '📖', value: Math.floor(days / 30).toLocaleString() + '本', label: '能读完的书 (约)' },
      { emoji: '🎬', value: (days * 2).toLocaleString() + '部', label: '能看的电影 (约)' },
    ];

    stats.forEach(s => {
      const item = document.createElement('div');
      item.className = 'fun-item';
      item.innerHTML = `
        <div class="fun-emoji">${s.emoji}</div>
        <div class="fun-value">${s.value}</div>
        <div class="fun-label">${s.label}</div>
      `;
      grid.appendChild(item);
    });
  }

  // ===== 壁纸生成器 =====
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

  // ===== 解压工具 =====
  let breathingExercise = null;
  let bubbleGame = null;

  function initTipsContent() {
    const content = document.getElementById('tips-content');
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

    switch(category) {
      case 'breathing':
        content.innerHTML = `
          <div class="breathing-container">
            <h4>${TIPS_DATA.breathing.title}</h4>
            <p style="color:var(--text-secondary);margin:8px 0 16px">${TIPS_DATA.breathing.description}</p>
            <div class="breath-circle" id="breath-circle">点击开始</div>
            <div class="breath-controls" id="breath-controls">
              ${TIPS_DATA.breathing.exercises.map((ex, i) => 
                `<button class="breath-btn ${i===0?'active':''}" data-inhale="${ex.inhale}" data-hold="${ex.hold}" data-exhale="${ex.exhale}">${ex.name}</button>`
              ).join('')}
            </div>
            <p style="color:var(--text-muted);margin-top:12px;font-size:0.85rem" id="breath-desc">${TIPS_DATA.breathing.exercises[0].desc}</p>
          </div>
        `;
        
        const circle = document.getElementById('breath-circle');
        breathingExercise = new BreathingExercise(circle);
        
        circle.addEventListener('click', () => {
          if (breathingExercise.isRunning) {
            breathingExercise.stop();
          } else {
            const activeBtn = document.querySelector('.breath-btn.active');
            breathingExercise.start(
              parseInt(activeBtn.dataset.inhale),
              parseInt(activeBtn.dataset.hold),
              parseInt(activeBtn.dataset.exhale)
            );
          }
        });
        
        document.querySelectorAll('.breath-btn').forEach((btn, i) => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.breath-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('breath-desc').textContent = TIPS_DATA.breathing.exercises[i].desc;
            if (breathingExercise.isRunning) {
              breathingExercise.stop();
              breathingExercise.start(
                parseInt(btn.dataset.inhale),
                parseInt(btn.dataset.hold),
                parseInt(btn.dataset.exhale)
              );
            }
          });
        });
        break;

      case 'game':
        content.innerHTML = `
          <div class="game-container">
            <h4>🫧 泡泡解压</h4>
            <p style="color:var(--text-secondary);margin:8px 0 16px">点击泡泡释放压力！</p>
            <div class="game-area">
              <div class="bubble-area" id="bubble-area"></div>
              <div class="game-score">得分：0</div>
              <button class="game-btn" id="game-start-btn">开始游戏</button>
            </div>
          </div>
        `;
        
        const bubbleArea = document.getElementById('bubble-area');
        bubbleGame = new BubbleGame(bubbleArea);
        
        document.getElementById('game-start-btn').addEventListener('click', function() {
          if (bubbleGame.isPlaying) {
            bubbleGame.stop();
            this.textContent = '开始游戏';
          } else {
            bubbleGame.start();
            this.textContent = '停止';
          }
        });
        break;

      case 'tips':
        content.innerHTML = `
          <div class="tips-list">
            ${TIPS_DATA.tips.items.map(tip => `
              <div class="tip-card">
                <div class="tip-card-title">${tip.emoji} ${tip.title}</div>
                <div class="tip-card-desc">${tip.desc}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;

      case 'quotes':
        content.innerHTML = `
          <div class="tips-list">
            ${TIPS_DATA.quotes.items.map(q => `
              <div class="tip-card" style="cursor:pointer" onclick="navigator.clipboard && navigator.clipboard.writeText('${q.text}')">
                <div class="tip-card-title">${q.emoji}</div>
                <div class="tip-card-desc" style="font-size:1.05rem;line-height:1.8">${q.text}</div>
              </div>
            `).join('')}
          </div>
        `;
        break;
    }
  }

  // ===== 小组件预览 =====
  function initWidgetPreview() {
    const container = document.getElementById('widget-previews');
    const life = calculateLife(state.birthday);
    const quote = getDailyQuote();

    container.innerHTML = `
      <div class="widget-preview-item">
        <h4>小组件 (小)</h4>
        <div class="widget-render">
          <div class="widget-mini">
            <div class="widget-mini-header">
              <span>🌅 人生三万天</span>
              <span>${new Date().getMonth()+1}/${new Date().getDate()}</span>
            </div>
            <div>
              <div class="widget-mini-days">${life.daysRemaining.toLocaleString()}</div>
              <div class="widget-mini-label">天剩余</div>
            </div>
            <div class="widget-mini-progress">
              <div class="widget-mini-progress-fill" style="width:${life.percentLived}%"></div>
            </div>
          </div>
        </div>
        <div class="widget-actions">
          <button class="widget-action-btn" onclick="copyWidgetCSS('small')">复制样式</button>
        </div>
      </div>

      <div class="widget-preview-item">
        <h4>小组件 (中)</h4>
        <div class="widget-render" style="overflow-x:auto">
          <div class="widget-medium">
            <div class="widget-medium-ring">
              <svg width="120" height="120" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
                <circle cx="100" cy="100" r="90" fill="none" stroke="url(#wg)" stroke-width="8" stroke-linecap="round"
                  stroke-dasharray="${2*Math.PI*90}" stroke-dashoffset="${2*Math.PI*90*(1-life.percentLived/100)}"
                  transform="rotate(-90 100 100)"/>
                <defs>
                  <linearGradient id="wg"><stop offset="0%" stop-color="#818cf8"/><stop offset="100%" stop-color="#ec4899"/></linearGradient>
                </defs>
                <text x="100" y="95" text-anchor="middle" fill="white" font-size="36" font-weight="900">${life.daysRemaining.toLocaleString()}</text>
                <text x="100" y="120" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-size="14">天</text>
              </svg>
            </div>
            <div class="widget-medium-info">
              <div class="widget-medium-title">🌅 人生三万天 · ${new Date().toLocaleDateString('zh-CN')}</div>
              <div class="widget-medium-quote">"${quote.text.substring(0, 40)}${quote.text.length > 40 ? '...' : ''}"</div>
              <div class="widget-medium-stats">
                <div class="widget-mini-stat"><strong>${life.yearsOld}</strong>岁</div>
                <div class="widget-mini-stat"><strong>${life.daysLived.toLocaleString()}</strong>天已过</div>
                <div class="widget-mini-stat"><strong>${life.percentLived}%</strong>已度过</div>
              </div>
            </div>
          </div>
        </div>
        <div class="widget-actions">
          <button class="widget-action-btn" onclick="copyWidgetCSS('medium')">复制样式</button>
        </div>
      </div>

      <div class="widget-preview-item">
        <h4>嵌入代码 (网页)</h4>
        <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:8px;font-size:0.8rem;color:var(--text-secondary);overflow-x:auto">
          <code>&lt;iframe src="${window.location.origin}/widget/widget.html" width="170" height="170" frameborder="0"&gt;&lt;/iframe&gt;</code>
        </div>
        <div class="widget-actions" style="margin-top:8px">
          <button class="widget-action-btn" onclick="navigator.clipboard.writeText('<iframe src=\\''+window.location.origin+'/widget/widget.html\\' width=\\'170\\' height=\\'170\\' frameborder=\\'0\\'></iframe>');showToast('已复制嵌入代码！')">复制代码</button>
        </div>
      </div>
    `;
  }

  // ===== 设置 =====
  function initSettings() {
    document.getElementById('settings-birthday').value = state.birthday || '';
    document.getElementById('settings-lifespan').value = state.lifespan;
    document.getElementById('lifespan-value').textContent = state.lifespan + ' 岁';
    document.getElementById('settings-reminder').checked = state.reminderEnabled;
    
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === state.themeColor);
    });
  }

  // ===== SVG 渐变 =====
  function addSVGGradient() {
    // 如果已有则不重复添加
    if (document.getElementById('progress-gradient')) return;
    
    const svg = document.querySelector('.progress-ring');
    if (!svg) return;
    
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style="stop-color:${state.themeColor}"/>
        <stop offset="100%" style="stop-color:#ec4899"/>
      </linearGradient>
    `;
    svg.insertBefore(defs, svg.firstChild);
  }

  // ===== 事件绑定 =====
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
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;
      const result = login(username, password);
      if (result.success) {
        if (state.birthday) {
          updateMainPage();
        } else {
          showPage('birthday-page');
        }
      } else {
        showToast(result.message);
      }
    });

    // 注册
    document.getElementById('register-form').addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value;
      const confirm = document.getElementById('reg-confirm').value;
      
      if (password !== confirm) {
        showToast('两次密码不一致');
        return;
      }
      if (password.length < 3) {
        showToast('密码至少3位');
        return;
      }
      
      const result = register(username, password);
      if (result.success) {
        login(username, password);
        showPage('birthday-page');
        showToast('注册成功！');
      } else {
        showToast(result.message);
      }
    });

    // 生日设置
    document.getElementById('start-journey-btn').addEventListener('click', () => {
      const birthday = document.getElementById('birthday-input').value;
      if (!birthday) {
        showToast('请选择你的生日');
        return;
      }
      
      const birth = new Date(birthday);
      const today = new Date();
      if (birth > today) {
        showToast('生日不能在未来');
        return;
      }
      
      state.birthday = birthday;
      
      // 保存到用户数据
      const users = getUsers();
      if (users[state.currentUser]) {
        users[state.currentUser].birthday = birthday;
        saveUsers(users);
      }
      
      updateMainPage();
      showToast('欢迎开启你的三万天旅程！✨');
    });

    // 金句操作
    document.getElementById('refresh-quote').addEventListener('click', refreshQuote);
    
    document.getElementById('copy-quote').addEventListener('click', () => {
      if (currentQuote) {
        const text = `"${currentQuote.text}" — ${currentQuote.author}`;
        navigator.clipboard.writeText(text).then(() => showToast('已复制！'));
      }
    });
    
    document.getElementById('share-quote').addEventListener('click', () => {
      if (currentQuote && navigator.share) {
        navigator.share({
          title: '人生三万天 · 每日金句',
          text: `"${currentQuote.text}" — ${currentQuote.author}`,
        });
      } else {
        showToast('当前浏览器不支持分享');
      }
    });

    // 壁纸
    document.getElementById('wallpaper-btn').addEventListener('click', () => {
      initWallpaperGenerator();
      showModal('wallpaper-modal');
    });
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
      const [w, h] = e.target.value.split('x').map(Number);
      wallpaperGen.setSize(w, h);
      wallpaperGen.generate();
    });

    document.getElementById('download-wallpaper').addEventListener('click', () => {
      wallpaperGen.download(`life-30000-days-${Date.now()}.png`);
      showToast('壁纸已保存！');
    });

    // 解压贴士
    document.getElementById('tips-btn').addEventListener('click', () => {
      initTipsContent();
      showModal('tips-modal');
    });
    document.getElementById('tips-close').addEventListener('click', () => {
      if (breathingExercise) breathingExercise.stop();
      if (bubbleGame) bubbleGame.stop();
      hideModal('tips-modal');
    });

    // 小组件
    document.getElementById('widget-btn').addEventListener('click', () => {
      initWidgetPreview();
      showModal('widget-modal');
    });
    document.getElementById('widget-close').addEventListener('click', () => hideModal('widget-modal'));

    // 设置
    document.getElementById('settings-btn').addEventListener('click', () => {
      initSettings();
      showModal('settings-modal');
    });
    document.getElementById('settings-close').addEventListener('click', () => hideModal('settings-modal'));

    document.getElementById('settings-lifespan').addEventListener('input', e => {
      document.getElementById('lifespan-value').textContent = e.target.value + ' 岁';
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.themeColor = btn.dataset.color;
        document.documentElement.style.setProperty('--primary', state.themeColor);
      });
    });

    document.getElementById('save-settings').addEventListener('click', () => {
      state.birthday = document.getElementById('settings-birthday').value;
      state.lifespan = parseInt(document.getElementById('settings-lifespan').value);
      state.reminderEnabled = document.getElementById('settings-reminder').checked;
      
      // 保存
      const users = getUsers();
      if (users[state.currentUser]) {
        users[state.currentUser].birthday = state.birthday;
        users[state.currentUser].lifespan = state.lifespan;
        saveUsers(users);
      }
      
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
          modal.classList.remove('active');
        }
      });
    });
  }

  // ===== 初始化 =====
  function init() {
    initParticles();
    bindEvents();

    // 检查自动登录
    const lastUser = storage('currentUser');
    if (lastUser) {
      const users = getUsers();
      if (users[lastUser]) {
        state.currentUser = lastUser;
        state.birthday = users[lastUser].birthday;
        state.lifespan = users[lastUser].lifespan || 80;
        
        if (state.birthday) {
          updateMainPage();
        } else {
          showPage('birthday-page');
        }
        return;
      }
    }
    
    // 更新登录页金句
    const quote = getDailyQuote();
    document.getElementById('login-quote').textContent = `"${quote.text}" — ${quote.author}`;
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // 暴露全局函数
  window.copyWidgetCSS = function(size) {
    showToast('已复制到剪贴板！');
  };
  window.showToast = showToast;

})();
