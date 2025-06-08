// 升级版成就系统

// 全部成就配置
export const achievementList = [
  { key: 'temptation', name: '面对诱惑' },
  { key: 'upright', name: '坚守底线' },
  { key: 'quizmaster', name: '答题达人' },
  { key: 'model', name: '廉洁楷模' },
  { key: 'fail', name: '失落结局' },
  { key: 'all', name: '全成就收集' },
  { key: 'noMistake', name: '零失误' },
  { key: 'speedrun', name: '速通达人' },
  { key: 'collector', name: '收集控' },
  { key: 'easterEgg', name: '神秘彩蛋' },
  { key: 'family', name: '家庭温情' },
  { key: 'honor', name: '坚守荣誉' }
];

// 解锁成就
export function unlockAchievement(key) {
  if (!window.gameState.achievements) window.gameState.achievements = {};
  if (!window.gameState.achievements[key]) {
    const found = achievementList.find(a => a.key === key);
    window.gameState.achievements[key] = {
      name: found ? found.name : key,
      time: Date.now()
    };
    window.saveState && window.saveState();

    // 动画提示
    if (window.currentPhaserScene && found) {
      const scene = window.currentPhaserScene;
      const toast = scene.add.text(
        scene.cameras.main.width/2, 80,
        `🏅 成就解锁：${found.name}`,
        { fontSize: '22px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 } }
      ).setOrigin(0.5).setDepth(100).setAlpha(1);
      scene.tweens.add({ targets: toast, alpha: 0, duration: 1200, delay: 1600, onComplete: () => toast.destroy() });
    }

    // 全成就检测
    const allKeys = achievementList.filter(a=>a.key!=='all').map(a=>a.key);
    if (allKeys.every(k => window.gameState.achievements[k])) {
      if (!window.gameState.achievements['all']) {
        window.gameState.achievements['all'] = { name: '全成就收集', time: Date.now() };
      }
    }
  }
}

// 展示成就面板
export function showAchievementsPanel(scene) {
  let y = 100;
  let bg = scene.add.rectangle(scene.cameras.main.width/2, y+120, 440, 360, 0xffffff, 0.98).setDepth(200);
  let title = scene.add.text(scene.cameras.main.width/2, y, '成就一览', {
    fontSize: '28px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(201);
  let items = [];
  let unlocked = window.gameState.achievements || {};
  achievementList.forEach((ach, i) => {
    let isUnlocked = unlocked[ach.key];
    let color = isUnlocked ? '#1e90ff' : '#bbb';
    let icon = isUnlocked ? '🏅' : '⬜';
    let timeStr = isUnlocked && isUnlocked.time ? `（${new Date(isUnlocked.time).toLocaleDateString()}）` : '';
    let txt = scene.add.text(scene.cameras.main.width/2-140, y+40+i*38,
      `${icon} ${ach.name}`, {
        fontSize: '20px', fill: color, fontFamily: 'Ma Shan Zheng'
      }).setOrigin(0,0.5).setDepth(201);
    let desc = scene.add.text(scene.cameras.main.width/2-60, y+40+i*38,
      ach.desc + timeStr, {
        fontSize: '16px', fill: '#666', fontFamily: 'Ma Shan Zheng'
      }).setOrigin(0,0.5).setDepth(201);
    items.push(txt, desc);
  });
  let closeBtn = scene.add.text(scene.cameras.main.width/2, y+320, '关闭', {
    fontSize: '18px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setDepth(201).setInteractive();
  closeBtn.on('pointerdown', () => {
    bg.destroy(); title.destroy(); closeBtn.destroy();
    items.forEach(t=>t.destroy());
  });
}
//网页弹窗
//import { achievementList } from './modules/achievements.js';

export function showAchievementsPanelForWeb() {
  const achs = Object.keys(window.gameState.achievements || {});
  const html = `<div id="achPanelMask" style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <div style="background:#fff;border-radius:18px;padding:2rem;min-width:320px;max-width:90vw;">
      <h2 style="color:#1e90ff;">成就面板</h2>
      <ul style="padding:0 1rem;max-height:320px;overflow:auto;">${
        achievementList.map(a =>
          `<li style="margin:0.5rem 0;opacity:${achs.includes(a.key)?1:0.3};color:#1e90ff;">${a.name}</li>`
        ).join('')
      }</ul>
      <button onclick="document.getElementById('achPanelMask').remove()" style="margin-top:1rem;">关闭</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}