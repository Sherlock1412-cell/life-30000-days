// ===== 解压贴士 & 趣味工具 =====

const TIPS_DATA = {
  breathing: {
    title: "🫁 呼吸练习",
    description: "跟随节奏深呼吸，快速缓解焦虑",
    exercises: [
      { name: "4-7-8 呼吸法", desc: "吸气4秒，屏息7秒，呼气8秒。睡前特别有效。", inhale: 4, hold: 7, exhale: 8 },
      { name: "方块呼吸", desc: "吸气4秒，屏息4秒，呼气4秒，屏息4秒。海豹突击队都在用。", inhale: 4, hold: 4, exhale: 4 },
      { name: "快速放松", desc: "吸气2秒，呼气4秒。快速降低心率。", inhale: 2, hold: 0, exhale: 4 },
    ]
  },
  game: {
    title: "🎮 解压小游戏",
    description: "点击泡泡释放压力",
  },
  tips: {
    title: "📖 解压小贴士",
    items: [
      { emoji: "🧘", title: "5分钟冥想", desc: "闭上眼睛，专注于呼吸。不需要什么特殊技巧，只要安静地坐着，观察自己的呼吸就好。推荐 App：潮汐、小睡眠" },
      { emoji: "📝", title: "写下来", desc: "把烦恼写在纸上，然后撕掉。这是一种象征性的释放，心理学研究证明书写疗法对减压非常有效。" },
      { emoji: "🎵", title: "听白噪音", desc: "雨声、海浪声、篝火声都能帮助放松。试试在工作时播放自然声音，效果出奇地好。" },
      { emoji: "🧊", title: "冰块刺激法", desc: "手握冰块30秒。强烈的温度刺激能迅速打断焦虑循环，把注意力拉回当下。" },
      { emoji: "🤸", title: "5-4-3-2-1 接地法", desc: "说出5个看到的、4个听到的、3个摸到的、2个闻到的、1个尝到的东西。快速缓解急性焦虑。" },
      { emoji: "💤", title: "10分钟小憩", desc: "NASA 研究发现 26 分钟的小睡能提高 34% 的警觉性和 54% 的表现。设好闹钟，短暂休息一下。" },
      { emoji: "🚿", title: "冷水洗脸", desc: "激活潜水反射，能迅速降低心率和血压。这是人体自带的急救机制，非常有效。" },
      { emoji: "📱", title: "数字断联", desc: "给自己30分钟不看手机的时间。研究显示持续的数字刺激会增加焦虑感。试试把手机放到另一个房间。" },
      { emoji: "🫂", title: "拥抱", desc: "20秒以上的拥抱能释放催产素，降低压力激素。找个人抱抱，或者抱个枕头也行。" },
      { emoji: "🌳", title: "走进自然", desc: "日本的'森林浴'疗法：在树林中安静地走20分钟，能显著降低皮质醇水平。没有树林？公园也行。" },
      { emoji: "😂", title: "看搞笑视频", desc: "笑能释放内啡肽，降低皮质醇。给自己5分钟看个搞笑视频，这不是偷懒，是科学。" },
      { emoji: "🎵", title: "唱歌", desc: "唱歌能刺激迷走神经，降低心率。在浴室、在车里，大声唱出来。不需要好听，只需要释放。" },
      { emoji: "🧩", title: "整理空间", desc: "整理一个抽屉或桌面。外在秩序感能帮助恢复内在秩序感。不必完美，开始就好。" },
      { emoji: "🍵", title: "泡杯热饮", desc: "双手捧着热杯子，这个动作本身就能增加社交温暖感。茶、咖啡、热可可都行。" },
      { emoji: "✍️", title: "感恩三件事", desc: "写下今天三件让你感恩的小事。研究表明，持续的感恩练习能显著提升幸福感。" },
    ]
  },
  quotes: {
    title: "💭 快速解压语录",
    items: [
      { emoji: "🌟", text: "你不需要把所有事情都做到完美。做到'足够好'就已经很棒了。" },
      { emoji: "🌊", text: "情绪就像海浪，来了就会走。你不需要控制它，只需要等它过去。" },
      { emoji: "🦋", text: "允许自己休息。你的价值不由你的生产力决定。" },
      { emoji: "🌈", text: "那些杀不死你的，会让你更强大——但你也可以选择不让它杀死你。先休息一下。" },
      { emoji: "🕯️", text: "你已经在尽力了。在你看到这句话的时候，请对自己说一句：辛苦了。" },
      { emoji: "🌻", text: "不是每一天都需要有意义。有些日子，活着就已经足够。" },
      { emoji: "🌙", text: "今天做不完的事，明天也还在那里。但今天的你，需要休息。" },
      { emoji: "⭐", text: "你不需要时刻坚强。偶尔的脆弱，也是人性的一部分。" },
      { emoji: "🍃", text: "把'我必须'换成'我选择'，你会发现世界轻松了很多。" },
      { emoji: "💫", text: "焦虑是想象力的浪费。与其担心未来，不如享受此刻的宁静。" },
      { emoji: "🎭", text: "你不需要讨好所有人。取悦自己，也是一种能力。" },
      { emoji: "🌅", text: "今天的太阳落下了，明天还会升起。给自己一个新的开始的机会。" },
    ]
  }
};

// 泡泡游戏逻辑
class BubbleGame {
  constructor(container) {
    this.container = container;
    this.score = 0;
    this.isPlaying = false;
    this.bubbles = [];
    this.interval = null;
  }

  start() {
    this.isPlaying = true;
    this.score = 0;
    this.bubbles = [];
    this.container.innerHTML = '';
    this.spawnBubble();
    this.interval = setInterval(() => this.spawnBubble(), 800);
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.interval);
  }

  spawnBubble() {
    if (!this.isPlaying) return;
    
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    const size = 30 + Math.random() * 30;
    bubble.style.width = size + 'px';
    bubble.style.height = size + 'px';
    
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    bubble.style.background = `radial-gradient(circle at 30% 30%, ${color}88, ${color})`;
    bubble.style.left = Math.random() * (this.container.offsetWidth - size) + 'px';
    bubble.style.top = Math.random() * (this.container.offsetHeight - size) + 'px';
    
    const emojis = ['😊', '😄', '🥰', '😎', '🤩', '✨', '💫', '⭐', '🌟', '💖'];
    bubble.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    bubble.style.fontSize = (size * 0.5) + 'px';
    
    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      this.popBubble(bubble);
    });
    
    this.container.appendChild(bubble);
    
    // 5秒后自动消失
    setTimeout(() => {
      if (bubble.parentNode && !bubble.classList.contains('pop')) {
        bubble.remove();
      }
    }, 5000);
  }

  popBubble(bubble) {
    if (bubble.classList.contains('pop')) return;
    bubble.classList.add('pop');
    this.score++;
    
    // 更新分数显示
    const scoreEl = this.container.parentElement.querySelector('.game-score');
    if (scoreEl) scoreEl.textContent = `得分：${this.score}`;
    
    setTimeout(() => bubble.remove(), 300);
  }
}

// 呼吸练习逻辑
class BreathingExercise {
  constructor(circle, display) {
    this.circle = circle;
    this.display = display;
    this.isRunning = false;
    this.timer = null;
  }

  start(inhale, hold, exhale) {
    this.isRunning = true;
    this.cycle(inhale, hold, exhale);
  }

  stop() {
    this.isRunning = false;
    clearTimeout(this.timer);
    this.circle.classList.remove('expand');
    this.circle.textContent = '点击开始';
  }

  cycle(inhale, hold, exhale) {
    if (!this.isRunning) return;

    // 吸气
    this.circle.textContent = `吸气 ${inhale}s`;
    this.circle.classList.add('expand');
    
    this.timer = setTimeout(() => {
      if (!this.isRunning) return;
      
      if (hold > 0) {
        // 屏息
        this.circle.textContent = `屏息 ${hold}s`;
        
        this.timer = setTimeout(() => {
          if (!this.isRunning) return;
          
          // 呼气
          this.circle.textContent = `呼气 ${exhale}s`;
          this.circle.classList.remove('expand');
          
          this.timer = setTimeout(() => {
            this.cycle(inhale, hold, exhale);
          }, exhale * 1000);
        }, hold * 1000);
      } else {
        // 呼气
        this.circle.textContent = `呼气 ${exhale}s`;
        this.circle.classList.remove('expand');
        
        this.timer = setTimeout(() => {
          this.cycle(inhale, hold, exhale);
        }, exhale * 1000);
      }
    }, inhale * 1000);
  }
}
