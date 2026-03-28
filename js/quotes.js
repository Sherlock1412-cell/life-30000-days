// ===== 金句数据库 =====
const QUOTES_DB = {
  // 励志类
  motivation: [
    { text: "每一天都是新的开始，不要浪费在过去的遗憾中。", author: "未知" },
    { text: "生活不是等待暴风雨过去，而是学会在雨中跳舞。", author: "Vivian Greene" },
    { text: "你的时间有限，不要浪费在过别人的生活上。", author: "Steve Jobs" },
    { text: "种一棵树最好的时间是十年前，其次是现在。", author: "中国谚语" },
    { text: "不要因为走得太远，而忘记为什么出发。", author: "纪伯伦" },
    { text: "成功的路上并不拥挤，因为坚持的人不多。", author: "未知" },
    { text: "你不必很厉害才能开始，但你必须开始才能变得很厉害。", author: "Zig Ziglar" },
    { text: "把每一天当作生命中的最后一天来过，总有一天你会是对的。", author: "Steve Jobs" },
    { text: "世界上只有一种真正的英雄主义，就是认清了生活的真相后依然热爱它。", author: "罗曼·罗兰" },
    { text: "人生如逆旅，我亦是行人。", author: "苏轼" },
  ],
  // 哲理类
  wisdom: [
    { text: "知之为知之，不知为不知，是知也。", author: "孔子" },
    { text: "天行健，君子以自强不息。", author: "《周易》" },
    { text: "千里之行，始于足下。", author: "老子" },
    { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原" },
    { text: "人生天地之间，若白驹过隙，忽然而已。", author: "庄子" },
    { text: "三十功名尘与土，八千里路云和月。", author: "岳飞" },
    { text: "世上本没有路，走的人多了便成了路。", author: "鲁迅" },
    { text: "生于忧患，死于安乐。", author: "孟子" },
    { text: "海纳百川，有容乃大；壁立千仞，无欲则刚。", author: "林则徐" },
    { text: "苟日新，日日新，又日新。", author: "《大学》" },
  ],
  // 治愈类
  healing: [
    { text: "你不必对每个人都好，你只需要对值得的人好。", author: "未知" },
    { text: "允许自己脆弱，这本身就是一种力量。", author: "未知" },
    { text: "慢一点也没关系，只要你一直在路上。", author: "未知" },
    { text: "对自己温柔一点，你也不过是宇宙中小小的孩子。", author: "未知" },
    { text: "今天的烦恼就留给今天的自己吧，明天的你会更强大。", author: "未知" },
    { text: "有些路很远，走下去会很累。可是，不走，会后悔。", author: "未知" },
    { text: "你正在经历的，别人也正在经历。你并不孤单。", author: "未知" },
    { text: "不完美才是真实的人生，接纳不完美的自己。", author: "未知" },
    { text: "所有你熬过的夜，都会变成光。", author: "未知" },
    { text: "允许一切发生，然后勇敢面对。", author: "未知" },
  ],
  // 时间类
  time: [
    { text: "时间就像海绵里的水，只要愿挤，总还是有的。", author: "鲁迅" },
    { text: "盛年不重来，一日难再晨。及时当勉励，岁月不待人。", author: "陶渊明" },
    { text: "一寸光阴一寸金，寸金难买寸光阴。", author: "谚语" },
    { text: "逝者如斯夫，不舍昼夜。", author: "孔子" },
    { text: "昨日之日不可留，今日之日多烦忧。", author: "李白" },
    { text: "时间是最公正的裁判，它不会因为你的懒惰而多等一秒。", author: "未知" },
    { text: "不要用战术上的勤奋，掩盖战略上的懒惰。", author: "雷军" },
    { text: "每一分钟的阅读，都是对生命的延长。", author: "未知" },
    { text: "浪费时间等于慢性自杀。", author: "谚语" },
    { text: "明日复明日，明日何其多。我生待明日，万事成蹉跎。", author: "钱福" },
  ],
  // 幽默类
  humor: [
    { text: "人生就像一杯茶，不会苦一辈子，但总会苦一阵子。", author: "未知" },
    { text: "生活不止眼前的苟且，还有远方的苟且。", author: "网友" },
    { text: "虽然我不能帮你上班，但我可以在你摸鱼的时候陪你聊天。", author: "未知" },
    { text: "钱没了可以再赚，朋友没了……可以再交，爱情没了可以再找，你什么都不缺，缺的是重新开始的勇气。", author: "未知" },
    { text: "每一个不曾起舞的日子，都是对生命的辜负。——主要是因为那天没开空调。", author: "改编" },
    { text: "努力不一定成功，但不努力真的很舒服。", author: "网友" },
    { text: "人生在世，还不是有时笑笑人家，有时给人家笑笑。", author: "林语堂" },
    { text: "生活就像心电图，一帆风顺就证明你挂了。", author: "未知" },
    { text: "今天的我你爱理不理，明天的我还来找你。", author: "未知" },
    { text: "没有什么事是一顿火锅解决不了的，如果有，那就两顿。", author: "网友" },
  ],
  // 英文类
  english: [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Be the change you wish to see in the world.", author: "Mahatma Gandhi" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  ],
  // 温馨类
  warmth: [
    { text: "愿你所到之处，遍地阳光；愿你所梦之景，皆能如愿。", author: "未知" },
    { text: "世界很大，幸福很小。有你们在，刚刚好。", author: "未知" },
    { text: "被人理解是幸运的，但不被理解也未必不幸。", author: "周国平" },
    { text: "你要记得那些黑暗中默默抱紧你的人，逗你笑的人，陪你彻夜聊天的人。", author: "佚名" },
    { text: "万物皆有裂痕，那是光照进来的地方。", author: "Leonard Cohen" },
    { text: "请相信，这个世界上真的有人在过着你想要的生活。", author: "大冰" },
    { text: "总有人间一两风，填我十万八千梦。", author: "未知" },
    { text: "星光不问赶路人，时光不负有心人。", author: "未知" },
    { text: "愿你眼中总有光芒，活成你想要的模样。", author: "未知" },
    { text: "岁月不居，时节如流。愿你安好，日日是好日。", author: "改编" },
    { text: "人生就像一盒巧克力，你永远不知道下一颗是什么味道。", author: "《阿甘正传》" },
    { text: "我们都在阴沟里，但仍有人仰望星空。", author: "王尔德" },
    { text: "愿你历尽千帆，归来仍是少年。", author: "未知" },
    { text: "生活明朗，万物可爱。人间值得，未来可期。", author: "未知" },
    { text: "你来人间一趟，你要看看太阳，和你的心上人，一起走在街上。", author: "海子" },
  ],
  // 季节类
  seasonal: [
    { text: "春天从不迟到，它只是偶尔绕了远路。", author: "未知" },
    { text: "夏日的遗憾，一定会被秋风温柔化解。", author: "未知" },
    { text: "冬日暖阳，好日常在。人间烟火，谁能不爱。", author: "未知" },
    { text: "秋天的风，都是从往年吹来的。", author: "木心" },
    { text: "每一个季节，都是一次重生的机会。", author: "未知" },
    { text: "春风十里，不如你的微笑。", author: "未知" },
    { text: "盛夏白瓷梅子汤，碎冰碰壁当啷响。", author: "未知" },
    { text: "雪夜里，生暖炉，促足相依偎，静闻雪落无痕。", author: "未知" },
  ]
};

// 根据日期生成固定的每日金句
function getDailyQuote() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  
  // 合并所有金句
  const allQuotes = Object.values(QUOTES_DB).flat();
  
  // 使用日期作为种子，确保每天不同但固定
  const seed = today.getFullYear() * 1000 + dayOfYear;
  const index = seed % allQuotes.length;
  
  return allQuotes[index];
}

// 获取随机金句
function getRandomQuote() {
  const allQuotes = Object.values(QUOTES_DB).flat();
  const index = Math.floor(Math.random() * allQuotes.length);
  return allQuotes[index];
}

// 根据剩余天数生成专属激励语
function generatePersonalMotivation(daysRemaining, yearsOld, daysLived) {
  const motivations = [];
  
  if (daysRemaining > 20000) {
    motivations.push(
      `你还拥有 ${daysRemaining.toLocaleString()} 天，相当于 ${Math.floor(daysRemaining/365)} 年。世界是你的画布，去创造吧！`,
      `${yearsOld} 岁，正是充满无限可能的年纪。每一天都是一张空白的画布。`,
      `你已经走过了 ${daysLived.toLocaleString()} 天的旅程，前方还有 ${daysRemaining.toLocaleString()} 个故事等你书写。`
    );
  } else if (daysRemaining > 15000) {
    motivations.push(
      `还有 ${daysRemaining.toLocaleString()} 天。不要等到某一天，就把今天变成那一天。`,
      `${yearsOld} 岁，你拥有了经验，也保留着热情。这是最好的年纪。`,
      `已经走过了人生约 ${Math.round(daysLived/(daysLived+daysRemaining)*100)}% 的旅程，接下来的每一步都值得珍惜。`
    );
  } else if (daysRemaining > 10000) {
    motivations.push(
      `还剩 ${daysRemaining.toLocaleString()} 天。重要的不是你还有多少天，而是你如何使用这些天。`,
      `${yearsOld} 岁，活在当下，珍惜身边的每一个人。`,
      `你已经积累了 ${yearsOld} 年的智慧，用它来照亮余下的每一天。`
    );
  } else {
    motivations.push(
      `每一天都是限量版，好好珍惜这 ${daysRemaining.toLocaleString()} 天。`,
      `${yearsOld} 岁，你比任何人都知道时间的珍贵。`,
      `过去的日子教你珍惜，未来的日子请你热爱。`
    );
  }
  
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  return motivations[seed % motivations.length];
}
