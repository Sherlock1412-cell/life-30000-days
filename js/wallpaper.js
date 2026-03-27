// ===== 壁纸生成引擎 =====

class WallpaperGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.style = 'gradient';
    this.quote = '';
    this.daysRemaining = 0;
    this.daysLived = 0;
    this.percentLived = 0;
  }

  setData(data) {
    Object.assign(this, data);
  }

  setStyle(style) {
    this.style = style;
  }

  setSize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  generate() {
    const { ctx, canvas } = this;
    const w = canvas.width;
    const h = canvas.height;

    // 清空
    ctx.clearRect(0, 0, w, h);

    // 根据风格绘制背景
    switch (this.style) {
      case 'gradient': this.drawGradientBg(w, h); break;
      case 'cosmic': this.drawCosmicBg(w, h); break;
      case 'nature': this.drawNatureBg(w, h); break;
      case 'minimal': this.drawMinimalBg(w, h); break;
      case 'retro': this.drawRetroBg(w, h); break;
      case 'watercolor': this.drawWatercolorBg(w, h); break;
    }

    // 绘制内容
    this.drawContent(w, h);
  }

  // 渐变背景
  drawGradientBg(w, h) {
    const { ctx } = this;
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0f0c29');
    grad.addColorStop(0.5, '#302b63');
    grad.addColorStop(1, '#24243e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 光晕效果
    for (let i = 0; i < 3; i++) {
      const x = w * (0.2 + Math.random() * 0.6);
      const y = h * (0.2 + Math.random() * 0.6);
      const r = Math.min(w, h) * (0.2 + Math.random() * 0.3);
      const grad2 = ctx.createRadialGradient(x, y, 0, x, y, r);
      const colors = ['rgba(99,102,241,0.15)', 'rgba(236,72,153,0.1)', 'rgba(139,92,246,0.1)'];
      grad2.addColorStop(0, colors[i]);
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // 宇宙背景
  drawCosmicBg(w, h) {
    const { ctx } = this;
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, w, h);

    // 星星
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.5;
      const alpha = 0.3 + Math.random() * 0.7;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }

    // 星云
    for (let i = 0; i < 4; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.min(w, h) * (0.15 + Math.random() * 0.25);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      const hue = Math.random() * 360;
      grad.addColorStop(0, `hsla(${hue}, 70%, 60%, 0.12)`);
      grad.addColorStop(0.5, `hsla(${hue}, 70%, 40%, 0.06)`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  }

  // 自然背景
  drawNatureBg(w, h) {
    const { ctx } = this;
    // 天空渐变
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    skyGrad.addColorStop(0, '#1a1a3e');
    skyGrad.addColorStop(0.5, '#2d3a6e');
    skyGrad.addColorStop(1, '#4a6741');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // 山脉
    ctx.fillStyle = '#1a2f1a';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.55);
    for (let x = 0; x <= w; x += 3) {
      const y = h * 0.55 + Math.sin(x * 0.008) * h * 0.08 + Math.sin(x * 0.003) * h * 0.05;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    ctx.fillStyle = '#153015';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    for (let x = 0; x <= w; x += 3) {
      const y = h * 0.65 + Math.sin(x * 0.01 + 1) * h * 0.05 + Math.sin(x * 0.004) * h * 0.03;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // 地面
    const groundGrad = ctx.createLinearGradient(0, h * 0.7, 0, h);
    groundGrad.addColorStop(0, '#0f2010');
    groundGrad.addColorStop(1, '#0a150a');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.7, w, h * 0.3);

    // 月亮
    const moonX = w * 0.75;
    const moonY = h * 0.15;
    const moonR = Math.min(w, h) * 0.06;
    const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 3);
    moonGlow.addColorStop(0, 'rgba(255,255,200,0.2)');
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, w, h * 0.4);
    
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffcc';
    ctx.fill();
  }

  // 极简背景
  drawMinimalBg(w, h) {
    const { ctx } = this;
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, w, h);

    // 淡色几何
    ctx.strokeStyle = 'rgba(0,0,0,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const size = 50 + Math.random() * 200;
      ctx.beginPath();
      ctx.rect(x, y, size, size);
      ctx.stroke();
    }
  }

  // 复古背景
  drawRetroBg(w, h) {
    const { ctx } = this;
    // 复古渐变
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#2d1b69');
    grad.addColorStop(0.3, '#6b2d5b');
    grad.addColorStop(0.6, '#d95f5f');
    grad.addColorStop(1, '#f0c27f');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 网格线
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let y = h * 0.5; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // 横线
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.5);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // 太阳
    const sunX = w / 2;
    const sunY = h * 0.4;
    const sunR = Math.min(w, h) * 0.15;
    
    for (let r = sunR; r > 0; r -= 3) {
      const t = r / sunR;
      ctx.beginPath();
      ctx.arc(sunX, sunY, r, Math.PI, 0);
      ctx.fillStyle = `rgba(${255}, ${Math.round(100 + t * 100)}, ${Math.round(50 + t * 100)}, ${0.8})`;
      ctx.fill();
    }
  }

  // 水彩背景
  drawWatercolorBg(w, h) {
    const { ctx } = this;
    ctx.fillStyle = '#f5f0eb';
    ctx.fillRect(0, 0, w, h);

    const colors = [
      'rgba(99,102,241,0.08)',
      'rgba(236,72,153,0.06)',
      'rgba(16,185,129,0.07)',
      'rgba(245,158,11,0.06)',
      'rgba(139,92,246,0.07)',
    ];

    for (let i = 0; i < 8; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 100 + Math.random() * 300;
      
      for (let j = 0; j < 5; j++) {
        ctx.beginPath();
        ctx.arc(x + (Math.random() - 0.5) * 50, y + (Math.random() - 0.5) * 50, r + Math.random() * 50, 0, Math.PI * 2);
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fill();
      }
    }
  }

  // 绘制内容
  drawContent(w, h) {
    const { ctx } = this;
    const isDark = this.style !== 'minimal' && this.style !== 'watercolor';
    const textColor = isDark ? '#ffffff' : '#1a1a2e';
    const subColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)';

    // 标题
    const titleSize = Math.round(w * 0.045);
    ctx.font = `300 ${titleSize}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = subColor;
    ctx.textAlign = 'center';
    ctx.fillText('人生三万天', w / 2, h * 0.2);

    // 剩余天数
    const daysSize = Math.round(w * 0.2);
    ctx.font = `900 ${daysSize}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 添加渐变效果到数字
    const grad = ctx.createLinearGradient(w * 0.2, h * 0.35, w * 0.8, h * 0.35);
    if (isDark) {
      grad.addColorStop(0, '#818cf8');
      grad.addColorStop(1, '#ec4899');
    } else {
      grad.addColorStop(0, '#4f46e5');
      grad.addColorStop(1, '#db2777');
    }
    ctx.fillStyle = grad;
    ctx.fillText(this.daysRemaining.toLocaleString(), w / 2, h * 0.38);

    // 标签
    const labelSize = Math.round(w * 0.035);
    ctx.font = `400 ${labelSize}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = subColor;
    ctx.fillText('天 剩 余', w / 2, h * 0.46);

    // 进度条
    const barW = w * 0.6;
    const barH = 6;
    const barX = (w - barW) / 2;
    const barY = h * 0.52;
    
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 3);
    ctx.fill();

    const fillW = barW * (this.percentLived / 100);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(barX, barY, fillW, barH, 3);
    ctx.fill();

    // 百分比
    ctx.font = `500 ${Math.round(w * 0.025)}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = subColor;
    ctx.fillText(`已度过 ${this.percentLived}%`, w / 2, barY + barH + 24);

    // 金句
    if (this.quote) {
      const quoteSize = Math.round(w * 0.03);
      ctx.font = `300 ${quoteSize}px "Noto Sans SC", sans-serif`;
      ctx.fillStyle = subColor;
      
      // 自动换行
      const maxWidth = w * 0.75;
      const words = this.quote.split('');
      let line = '';
      let lines = [];
      
      for (let char of words) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          lines.push(line);
          line = char;
        } else {
          line = testLine;
        }
      }
      lines.push(line);
      
      const lineHeight = quoteSize * 1.6;
      const startY = h * 0.65;
      
      lines.forEach((l, i) => {
        ctx.fillText(l, w / 2, startY + i * lineHeight);
      });
    }

    // 底部水印
    ctx.font = `300 ${Math.round(w * 0.018)}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
    ctx.fillText('🌅 life-30000-days', w / 2, h * 0.92);
    
    // 日期
    const today = new Date();
    const dateStr = `${today.getFullYear()}.${String(today.getMonth()+1).padStart(2,'0')}.${String(today.getDate()).padStart(2,'0')}`;
    ctx.fillText(dateStr, w / 2, h * 0.95);
  }

  // 下载
  download(filename) {
    const link = document.createElement('a');
    link.download = filename || 'life-30000-days.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }

  // 截图
  toDataURL() {
    return this.canvas.toDataURL('image/png');
  }
}
