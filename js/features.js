// ===== 新功能模块：白噪音 / 感恩日记 / 冥想 / 年报 / 挑战 / 成就 =====

// ==========================================
// 🎵 白噪音播放器
// ==========================================
const SOUNDS_DATA = [
  { id: 'rain', emoji: '🌧️', name: '雨声', freq: 'brown' },
  { id: 'ocean', emoji: '🌊', name: '海浪', freq: 'pink' },
  { id: 'fire', emoji: '🔥', name: '篝火', freq: 'brown' },
  { id: 'forest', emoji: '🌿', name: '森林', freq: 'pink' },
  { id: 'wind', emoji: '💨', name: '风声', freq: 'white' },
  { id: 'thunder', emoji: '⛈️', name: '雷雨', freq: 'brown' },
  { id: 'night', emoji: '🦗', name: '夏夜', freq: 'pink' },
  { id: 'coffee', emoji: '☕', name: '咖啡馆', freq: 'pink' },
  { id: 'keyboard', emoji: '⌨️', name: '键盘', freq: 'white' },
  { id: 'train', emoji: '🚂', name: '火车', freq: 'brown' },
  { id: 'snow', emoji: '❄️', name: '雪天', freq: 'white' },
  { id: 'stream', emoji: '🏞️', name: '溪流', freq: 'pink' },
];

class WhiteNoisePlayer {
  constructor() {
    this.audioCtx = null;
    this.activeSounds = {};
    this.volumes = {};
  }

  getContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioCtx;
  }

  createNoise(type) {
    const ctx = this.getContext();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else { // brown
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }
    }

    return buffer;
  }

  play(soundData) {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') ctx.resume();

    const buffer = this.createNoise(soundData.freq);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gainNode = ctx.createGain();
    const volume = this.volumes[soundData.id] || 0.5;
    gainNode.gain.value = volume;

    // 低通滤波器让声音更自然
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = soundData.id === 'rain' ? 2000 :
      soundData.id === 'thunder' ? 500 :
      soundData.id === 'wind' ? 800 :
      soundData.id === 'fire' ? 1500 : 3000;

    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    source.start();

    this.activeSounds[soundData.id] = { source, gainNode, filter };
  }

  stop(id) {
    if (this.activeSounds[id]) {
      const { source, gainNode } = this.activeSounds[id];
      // 淡出
      gainNode.gain.linearRampToValueAtTime(0, this.getContext().currentTime + 0.3);
      setTimeout(() => {
        try { source.stop(); } catch(e) {}
      }, 350);
      delete this.activeSounds[id];
    }
  }

  setVolume(id, vol) {
    this.volumes[id] = vol;
    if (this.activeSounds[id]) {
      this.activeSounds[id].gainNode.gain.value = vol;
    }
  }

  isPlaying(id) {
    return !!this.activeSounds[id];
  }

  stopAll() {
    Object.keys(this.activeSounds).forEach(id => this.stop(id));
  }

  getActiveCount() {
    return Object.keys(this.activeSounds).length;
  }
}

// ==========================================
// 📝 每日感恩日记
// ==========================================
class GratitudeJournal {
  constructor() {
    this.storageKey = 'life30000_gratitude';
  }

  getKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.storageKey)) || {}; } catch { return {}; }
  }

  saveAll(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getToday() {
    const all = this.getAll();
    return all[this.getKey()] || ['', '', ''];
  }

  saveToday(entries) {
    const all = this.getAll();
    all[this.getKey()] = entries;
    this.saveAll(all);
  }

  getStreak() {
    const all = this.getAll();
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const entry = all[key];
      if (entry && entry.some(e => e && e.trim())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }

  getTotalEntries() {
    const all = this.getAll();
    let total = 0;
    Object.values(all).forEach(entries => {
      if (Array.isArray(entries)) {
        total += entries.filter(e => e && e.trim()).length;
      }
    });
    return total;
  }

  getRandomPrompt() {
    const prompts = [
      '今天谁让你微笑了？',
      '有什么小事让你感到温暖？',
      '你最感谢今天的什么？',
      '谁的存在让你觉得幸运？',
      '今天学到了什么新东西？',
      '什么让你今天感到快乐？',
      '你的身体今天做了什么很棒的事？',
      '今天有什么美好的意外？',
      '你最珍惜今天的哪个瞬间？',
      '谁帮助了你今天？',
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}

// ==========================================
// 🧘 冥想计时器
// ==========================================
class MeditationTimer {
  constructor() {
    this.isRunning = false;
    this.isPaused = false;
    this.totalSeconds = 0;
    this.remainingSeconds = 0;
    this.interval = null;
    this.onTick = null;
    this.onComplete = null;
    this.storageKey = 'life30000_meditation';
  }

  start(minutes, onTick, onComplete) {
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isRunning = true;
    this.isPaused = false;
    this.onTick = onTick;
    this.onComplete = onComplete;

    this.interval = setInterval(() => {
      if (!this.isPaused && this.isRunning) {
        this.remainingSeconds--;
        if (this.onTick) this.onTick(this.remainingSeconds, this.totalSeconds);
        if (this.remainingSeconds <= 0) {
          this.complete();
        }
      }
    }, 1000);
  }

  pause() {
    this.isPaused = !this.isPaused;
    return this.isPaused;
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    clearInterval(this.interval);
  }

  complete() {
    this.stop();
    this.recordSession(this.totalSeconds);
    if (this.onComplete) this.onComplete();
  }

  recordSession(seconds) {
    const data = this.getStats();
    data.sessions++;
    data.totalSeconds += seconds;
    data.dates = data.dates || [];
    const today = new Date().toISOString().split('T')[0];
    if (!data.dates.includes(today)) data.dates.push(today);
    if (seconds > data.longestSession) data.longestSession = seconds;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getStats() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || {
        sessions: 0, totalSeconds: 0, longestSession: 0, dates: []
      };
    } catch {
      return { sessions: 0, totalSeconds: 0, longestSession: 0, dates: [] };
    }
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
}

// ==========================================
// 📊 年度生命报告
// ==========================================
class LifeReport {
  generate(birthday, lifespan) {
    const birth = new Date(birthday);
    const today = new Date();
    const daysLived = Math.floor((today - birth) / 86400000);
    const totalDays = Math.floor(lifespan * 365.25);
    const daysRemaining = totalDays - daysLived;
    const yearsOld = (daysLived / 365.25);

    // 今年数据
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const daysThisYear = Math.floor((today - yearStart) / 86400000) + 1;
    const yearProgress = ((daysThisYear / 365) * 100).toFixed(1);

    // 生命中
    const monthsLived = Math.floor(daysLived / 30.44);
    const weeksLived = Math.floor(daysLived / 7);

    // 趣味换算
    const heartbeats = daysLived * 24 * 60 * 72;
    const breaths = daysLived * 20000;
    const sleepHours = daysLived * 8;
    const meals = daysLived * 3;
    const steps = daysLived * 5000;

    // 感恩日记数据
    const journal = new GratitudeJournal();
    const totalGratitude = journal.getTotalEntries();
    const gratitudeStreak = journal.getStreak();

    // 冥想数据
    const meditationStats = new MeditationTimer().getStats();

    // 成就数据
    const achievements = new AchievementSystem();
    const unlocked = achievements.getUnlocked();
    const totalAchievements = achievements.getAll().length;

    // 生命阶段
    let lifeStage = '';
    if (yearsOld < 6) lifeStage = '幼儿期 · 探索世界';
    else if (yearsOld < 13) lifeStage = '童年 · 纯真年代';
    else if (yearsOld < 18) lifeStage = '青春期 · 燃烧的青春';
    else if (yearsOld < 25) lifeStage = '青年 · 梦想起航';
    else if (yearsOld < 35) lifeStage = '壮年 · 奋斗年华';
    else if (yearsOld < 50) lifeStage = '中年 · 沉淀与收获';
    else if (yearsOld < 65) lifeStage = '成熟期 · 智慧之年';
    else lifeStage = '黄金期 · 从容优雅';

    // 特殊日期
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const daysUntilBirthday = (() => {
      const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
      if (next < today) next.setFullYear(next.getFullYear() + 1);
      return Math.ceil((next - today) / 86400000);
    })();

    return {
      yearsOld: yearsOld.toFixed(1),
      daysLived, daysRemaining, totalDays,
      monthsLived, weeksLived,
      heartbeats, breaths, sleepHours, meals, steps,
      daysThisYear, yearProgress,
      lifeStage, dayOfYear, daysUntilBirthday,
      totalGratitude, gratitudeStreak,
      meditationSessions: meditationStats.sessions,
      meditationMinutes: Math.floor(meditationStats.totalSeconds / 60),
      achievementsUnlocked: unlocked.length,
      totalAchievements,
      birthday: birthday,
      lifespan,
    };
  }
}

// ==========================================
// 🎲 随机挑战任务
// ==========================================
const CHALLENGES = [
  // 创意类
  { emoji: '✍️', title: '写一首三行诗', desc: '随便写，押韵不押韵都行', category: '创意' },
  { emoji: '🎨', title: '用非惯用手画画', desc: '画什么都行，越丑越好笑', category: '创意' },
  { emoji: '📸', title: '拍10张照片', desc: '记录今天的10个瞬间', category: '创意' },
  { emoji: '🎵', title: '即兴哼一段旋律', desc: '不需要歌词，哼出来就好', category: '创意' },
  { emoji: '📝', title: '给未来的自己写封信', desc: '一年后打开看看', category: '创意' },
  // 社交类
  { emoji: '💬', title: '和一个陌生人微笑', desc: '出门时对路人微笑一下', category: '社交' },
  { emoji: '📞', title: '给老朋友发条消息', desc: '找一个很久没联系的人聊聊', category: '社交' },
  { emoji: '🤗', title: '拥抱一个人', desc: '家人、朋友、宠物都算', category: '社交' },
  { emoji: '🙏', title: '真诚感谢一个人', desc: '说出具体的感谢，而不只是"谢谢"', category: '社交' },
  // 健康类
  { emoji: '🚶', title: '走5000步', desc: '出去走走，呼吸新鲜空气', category: '健康' },
  { emoji: '💧', title: '喝8杯水', desc: '今天好好喝水', category: '健康' },
  { emoji: '🧘', title: '冥想5分钟', desc: '安静地坐着，专注呼吸', category: '健康' },
  { emoji: '🤸', title: '做20个深蹲', desc: '随时随地，做就完了', category: '健康' },
  { emoji: '😴', title: '23点前睡觉', desc: '今晚早点休息', category: '健康' },
  // 学习类
  { emoji: '📖', title: '读20页书', desc: '随便什么书，读就好', category: '学习' },
  { emoji: '🌍', title: '学一个新单词', desc: '任何语言都行', category: '学习' },
  { emoji: '🎬', title: '看一个TED演讲', desc: '18分钟涨点知识', category: '学习' },
  { emoji: '💻', title: '学一个新快捷键', desc: 'Ctrl+什么？试试看', category: '学习' },
  // 生活类
  { emoji: '🧹', title: '整理一个抽屉', desc: '找到一个乱的抽屉，整理它', category: '生活' },
  { emoji: '🍳', title: '做一道没做过的菜', desc: '跟着菜谱尝试一下', category: '生活' },
  { emoji: '🌸', title: '观察一朵花', desc: '认真看一分钟，感受它的美', category: '生活' },
  { emoji: '📵', title: '1小时不看手机', desc: '放下手机，感受现实世界', category: '生活' },
  { emoji: '🎁', title: '给自己买个小礼物', desc: '不需要贵，开心就好', category: '生活' },
  { emoji: '🕯️', title: '点一支蜡烛', desc: '安静地看火焰5分钟', category: '生活' },
  { emoji: '🎭', title: '讲一个冷笑话', desc: '对一个人讲，看反应', category: '生活' },
  { emoji: '🌈', title: '找三种颜色', desc: '出门找红、黄、蓝三样东西', category: '生活' },
];

class ChallengeSystem {
  constructor() {
    this.storageKey = 'life30000_challenges';
  }

  getKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  getTodayChallenge() {
    const all = this.getAll();
    const key = this.getKey();
    if (all[key]) return all[key];

    // 用日期作为种子选一个
    const seed = new Date().getFullYear() * 1000 + Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    const challenge = CHALLENGES[seed % CHALLENGES.length];
    all[key] = { ...challenge, completed: false, completedAt: null };
    this.saveAll(all);
    return all[key];
  }

  completeToday() {
    const all = this.getAll();
    const key = this.getKey();
    if (all[key]) {
      all[key].completed = true;
      all[key].completedAt = new Date().toISOString();
      this.saveAll(all);
    }
  }

  getNewChallenge() {
    const all = this.getAll();
    const key = this.getKey();
    let idx;
    do {
      idx = Math.floor(Math.random() * CHALLENGES.length);
    } while (all[key] && CHALLENGES[idx].title === all[key].title);
    all[key] = { ...CHALLENGES[idx], completed: false, completedAt: null };
    this.saveAll(all);
    return all[key];
  }

  getAll() {
    try { return JSON.parse(localStorage.getItem(this.storageKey)) || {}; } catch { return {}; }
  }

  saveAll(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getStats() {
    const all = this.getAll();
    const entries = Object.values(all);
    const completed = entries.filter(e => e.completed).length;
    const total = entries.length;
    
    // 连续完成天数
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      if (all[key] && all[key].completed) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return { completed, total, streak };
  }
}

// ==========================================
// 🏆 成就系统
// ==========================================
const ACHIEVEMENTS = [
  // 基础成就
  { id: 'first_day', emoji: '🌅', title: '初来乍到', desc: '第一次打开应用', check: (s) => s.daysLived >= 0 },
  { id: 'week_1', emoji: '📅', title: '一周之约', desc: '使用应用 7 天', check: (s) => s.visitDays >= 7 },
  { id: 'month_1', emoji: '📆', title: '月度会员', desc: '使用应用 30 天', check: (s) => s.visitDays >= 30 },
  
  // 生命成就
  { id: 'age_18', emoji: '🎂', title: '成年礼', desc: '活了 18 年', check: (s) => s.daysLived >= 18 * 365 },
  { id: 'age_30', emoji: '🎯', title: '三十而立', desc: '活了 30 年', check: (s) => s.daysLived >= 30 * 365 },
  { id: 'age_50', emoji: '🏅', title: '知天命', desc: '活了 50 年', check: (s) => s.daysLived >= 50 * 365 },
  { id: 'days_1000', emoji: '💯', title: '千日里程碑', desc: '活了 1000 天', check: (s) => s.daysLived >= 1000 },
  { id: 'days_10000', emoji: '🔥', title: '万日人生', desc: '活了 10000 天', check: (s) => s.daysLived >= 10000 },
  { id: 'days_20000', emoji: '💎', title: '两万天旅人', desc: '活了 20000 天', check: (s) => s.daysLived >= 20000 },
  { id: 'days_25000', emoji: '👑', title: '生命王者', desc: '活了 25000 天', check: (s) => s.daysLived >= 25000 },
  
  // 感恩日记
  { id: 'gratitude_1', emoji: '📝', title: '感恩之心', desc: '写第一条感恩日记', check: (s) => s.totalGratitude >= 1 },
  { id: 'gratitude_10', emoji: '📗', title: '感恩达人', desc: '写 10 条感恩日记', check: (s) => s.totalGratitude >= 10 },
  { id: 'gratitude_50', emoji: '📘', title: '感恩大师', desc: '写 50 条感恩日记', check: (s) => s.totalGratitude >= 50 },
  { id: 'gratitude_streak_7', emoji: '🔥', title: '七日感恩', desc: '连续 7 天写感恩日记', check: (s) => s.gratitudeStreak >= 7 },
  { id: 'gratitude_streak_30', emoji: '🏆', title: '月度感恩', desc: '连续 30 天写感恩日记', check: (s) => s.gratitudeStreak >= 30 },
  
  // 冥想
  { id: 'meditation_1', emoji: '🧘', title: '初入禅境', desc: '完成第一次冥想', check: (s) => s.meditationSessions >= 1 },
  { id: 'meditation_10', emoji: '🪷', title: '禅修入门', desc: '完成 10 次冥想', check: (s) => s.meditationSessions >= 10 },
  { id: 'meditation_50', emoji: '☯️', title: '冥想达人', desc: '完成 50 次冥想', check: (s) => s.meditationSessions >= 50 },
  { id: 'meditation_1h', emoji: '⏱️', title: '时间静止', desc: '累计冥想 1 小时', check: (s) => s.meditationTotalMinutes >= 60 },
  { id: 'meditation_10h', emoji: '🕐', title: '十时禅修', desc: '累计冥想 10 小时', check: (s) => s.meditationTotalMinutes >= 600 },
  
  // 挑战
  { id: 'challenge_1', emoji: '🎲', title: '挑战者', desc: '完成第一个挑战', check: (s) => s.challengesCompleted >= 1 },
  { id: 'challenge_10', emoji: '⚔️', title: '战士', desc: '完成 10 个挑战', check: (s) => s.challengesCompleted >= 10 },
  { id: 'challenge_30', emoji: '🛡️', title: '勇士', desc: '完成 30 个挑战', check: (s) => s.challengesCompleted >= 30 },
  { id: 'challenge_streak_7', emoji: '🔥', title: '连续挑战', desc: '连续 7 天完成挑战', check: (s) => s.challengeStreak >= 7 },
  
  // 壁纸
  { id: 'wallpaper_1', emoji: '🎨', title: '艺术家', desc: '生成第一张壁纸', check: (s) => s.wallpapersGenerated >= 1 },
  { id: 'wallpaper_10', emoji: '🖼️', title: '壁纸收藏家', desc: '生成 10 张壁纸', check: (s) => s.wallpapersGenerated >= 10 },
  
  // 白噪音
  { id: 'noise_1', emoji: '🎵', title: '聆听者', desc: '播放白噪音 1 次', check: (s) => s.noisePlayCount >= 1 },
  { id: 'noise_mix', emoji: '🎶', title: '混音师', desc: '同时混合 3 种白噪音', check: (s) => s.maxNoiseMix >= 3 },
  
  // 特殊成就
  { id: 'quote_copy', emoji: '📋', title: '金句收集者', desc: '复制金句 5 次', check: (s) => s.quotesCopied >= 5 },
  { id: 'all_categories', emoji: '🌟', title: '全能选手', desc: '解锁 5 个不同类别的成就', check: (s) => s.categoriesUnlocked >= 5 },
];

class AchievementSystem {
  constructor() {
    this.storageKey = 'life30000_achievements';
  }

  getAll() {
    return ACHIEVEMENTS;
  }

  getUnlocked() {
    try { return JSON.parse(localStorage.getItem(this.storageKey)) || []; } catch { return []; }
  }

  saveUnlocked(ids) {
    localStorage.setItem(this.storageKey, JSON.stringify(ids));
  }

  check(birthday, lifespan, extraStats) {
    if (!birthday) return [];
    
    const birth = new Date(birthday);
    const today = new Date();
    const daysLived = Math.floor((today - birth) / 86400000);

    // 各模块数据
    const journal = new GratitudeJournal();
    const meditation = new MeditationTimer().getStats();
    const challenge = new ChallengeSystem().getStats();
    
    // 访问天数
    let visitDays = 0;
    try { visitDays = (JSON.parse(localStorage.getItem('life30000_visits')) || []).length; } catch {}

    const stats = {
      daysLived,
      visitDays,
      totalGratitude: journal.getTotalEntries(),
      gratitudeStreak: journal.getStreak(),
      meditationSessions: meditation.sessions,
      meditationTotalMinutes: Math.floor(meditation.totalSeconds / 60),
      challengesCompleted: challenge.completed,
      challengeStreak: challenge.streak,
      wallpapersGenerated: 0,
      noisePlayCount: 0,
      maxNoiseMix: 0,
      quotesCopied: 0,
      categoriesUnlocked: 0,
      ...extraStats,
    };

    const unlocked = this.getUnlocked();
    const newlyUnlocked = [];

    ACHIEVEMENTS.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.check(stats)) {
        unlocked.push(ach.id);
        newlyUnlocked.push(ach);
      }
    });

    // 统计解锁类别
    const categories = new Set();
    unlocked.forEach(id => {
      const ach = ACHIEVEMENTS.find(a => a.id === id);
      if (ach) {
        if (id.includes('gratitude')) categories.add('gratitude');
        else if (id.includes('meditation')) categories.add('meditation');
        else if (id.includes('challenge')) categories.add('challenge');
        else if (id.includes('wallpaper')) categories.add('wallpaper');
        else if (id.includes('noise')) categories.add('noise');
        else if (id.includes('age') || id.includes('days')) categories.add('life');
        else categories.add('other');
      }
    });
    stats.categoriesUnlocked = categories.size;

    // 二次检查
    ACHIEVEMENTS.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.check(stats)) {
        unlocked.push(ach.id);
        newlyUnlocked.push(ach);
      }
    });

    this.saveUnlocked(unlocked);
    return newlyUnlocked;
  }
}

// 记录访问天数
function recordVisit() {
  const key = 'life30000_visits';
  let visits = [];
  try { visits = JSON.parse(localStorage.getItem(key)) || []; } catch {}
  const today = new Date().toISOString().split('T')[0];
  if (!visits.includes(today)) {
    visits.push(today);
    localStorage.setItem(key, JSON.stringify(visits));
  }
}

// 记录壁纸生成
function recordWallpaper() {
  const key = 'life30000_wallpaper_count';
  let count = parseInt(localStorage.getItem(key) || '0');
  count++;
  localStorage.setItem(key, String(count));
}

// 记录金句复制
function recordQuoteCopy() {
  const key = 'life30000_quote_copies';
  let count = parseInt(localStorage.getItem(key) || '0');
  count++;
  localStorage.setItem(key, String(count));
}

// 记录白噪音播放
function recordNoise(count) {
  const key = 'life30000_noise_play';
  let c = parseInt(localStorage.getItem(key) || '0');
  c++;
  localStorage.setItem(key, String(c));
  
  const mixKey = 'life30000_noise_mix';
  const maxMix = parseInt(localStorage.getItem(mixKey) || '0');
  if (count > maxMix) localStorage.setItem(mixKey, String(count));
}
