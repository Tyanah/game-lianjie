// 收集要素与辅助功能模块

// 全部收集项配置
export const collectionList = [
  { key: 'motto1', name: '清心为治本' },
  { key: 'motto2', name: '克己奉公' },
  { key: 'person1', name: '包拯' },
  { key: 'person2', name: '焦裕禄' },
  { key: 'egg1', name: '神秘彩蛋' }
];

// 解锁收集项
export function unlockCollection(key) {
  if (!window.gameState.collection) window.gameState.collection = [];
  if (!window.gameState.collection.includes(key)) {
    window.gameState.collection.push(key);
    window.saveState && window.saveState();
  }
}

//import { collectionList } from './collection.js'; // 确保有 collectionList

export function showCollectionPanelForWeb() {
  const cols = window.gameState.collection || [];
  const html = `<div id="colPanelMask" style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <div style="background:#fff;border-radius:18px;padding:2rem;min-width:320px;max-width:90vw;">
      <h2 style="color:#1e90ff;">收集要素</h2>
      <ul style="padding:0 1rem;">${
        (collectionList||[]).map(c =>
          `<li style="margin:0.5rem 0;opacity:${cols.includes(c.key)?1:0.3};color:#1e90ff;">${c.name}</li>`
        ).join('')
      }</ul>
      <button onclick="document.getElementById('colPanelMask').remove()" style="margin-top:1rem;">关闭</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

export function showAssistPanelForWeb() {
  const html = `<div id="assistPanelMask" style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <div style="background:#fff;border-radius:18px;padding:2rem;min-width:320px;max-width:90vw;">
      <h2 style="color:#1e90ff;">帮助与辅助功能</h2>
      <div style="color:#333;font-size:1.1rem;line-height:1.8;">
        <ul>
          <li>点击场景内物品可探索线索</li>
          <li>遇到选择题请认真作答</li>
          <li>小游戏可提升属性与解锁成就</li>
          <li>如遇卡顿可刷新页面</li>
          <li>支持键盘与屏幕按钮操作</li>
        </ul>
      </div>
      <button onclick="document.getElementById('assistPanelMask').remove()" style="margin-top:1rem;">关闭</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}


// 展示收集面板
export function showCollectionPanel(scene) {
  let y = 100;
  let bg = scene.add.rectangle(scene.cameras.main.width/2, y+120, 440, 320, 0xffffff, 0.98).setDepth(200);
  let title = scene.add.text(scene.cameras.main.width/2, y, '收集要素', {
    fontSize: '28px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(201);

  let items = [];
  let unlocked = window.gameState.collection || [];
  collectionList.forEach((item, i) => {
    let isUnlocked = unlocked.includes(item.key);
    let color = isUnlocked ? '#1e90ff' : '#bbb';
    let icon = isUnlocked ? '✔' : '✖';
    let txt = scene.add.text(scene.cameras.main.width/2-140, y+40+i*38,
      `${icon} ${item.name}`, {
        fontSize: '20px', fill: color, fontFamily: 'Ma Shan Zheng'
      }).setOrigin(0,0.5).setDepth(201);
    let desc = scene.add.text(scene.cameras.main.width/2-60, y+40+i*38,
      item.desc, {
        fontSize: '16px', fill: '#666', fontFamily: 'Ma Shan Zheng'
      }).setOrigin(0,0.5).setDepth(201);
    items.push(txt, desc);
  });
  let closeBtn = scene.add.text(scene.cameras.main.width/2, y+250, '关闭', {
    fontSize: '18px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setDepth(201).setInteractive();
  closeBtn.on('pointerdown', () => {
    bg.destroy(); title.destroy(); closeBtn.destroy();
    items.forEach(t=>t.destroy());
  });
}

// 辅助功能面板（可扩展更多设置）
export function showAssistPanel() {
  alert('辅助功能：\n- 支持键盘Tab导航\n- 支持高对比度模式（浏览器自带）\n- 可随时重置存档\n- 手机/PC自适应\n如有建议请反馈！');
}