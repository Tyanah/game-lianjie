// NPC 配置，可扩展更多角色
const npcList = [
  { key: 'father', name: '父亲', desc: '关心你的家人' },
  { key: 'colleague', name: '同事', desc: '与你共事的伙伴' },
  { key: 'leader', name: '领导', desc: '你的上级' },
  { key: 'model', name: '榜样', desc: '身边的廉洁榜样' }
];

// 更新好感度
export function updateNpcFavor(npc, delta) {
  if (!window.gameState.npcFavor) window.gameState.npcFavor = {};
  window.gameState.npcFavor[npc] = (window.gameState.npcFavor[npc] || 0) + delta;
  window.saveState();
}

// 获取NPC评价
export function getNpcComment(npcKey) {
  if (!window.gameState || !gameState.choices || !gameState.choices.scene1) return '';
  const c = gameState.choices.scene1;
  if (npcKey === 'leader') {
    if (c.gift === 'accept') return '（某人皱起了眉头，似乎对你的选择感到失望）';
    if (c.gift === 'reject') return '（某人露出赞许的微笑，认可你的坚守）';
  }
  if (npcKey === 'father') {
    if (c.phone === 'call') return '（父亲在电话那头感到欣慰）';
    if (c.phone === 'ignore') return '（父亲有些失落，久久没有再打来）';
  }
  return '';
}

// 获取NPC中文名
export function getNpcName(npc) {
  const found = npcList.find(n => n.key === npc);
  return found ? found.name : npc;
}

// 展示好感度面板
export function showNpcFavorPanel(scene) {
  let y = 120;
  let bg = scene.add.rectangle(scene.cameras.main.width/2, y+60, 340, 220, 0xffffff, 0.98).setDepth(200);
  let title = scene.add.text(scene.cameras.main.width/2, y, 'NPC好感度', {
    fontSize: '24px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(201);
  let items = [];
  npcList.forEach((npc, i) => {
    let favor = (window.gameState.npcFavor && window.gameState.npcFavor[npc.key]) || 0;
    let txt = scene.add.text(scene.cameras.main.width/2, y+40+i*38,
      `${npc.name}：${favor}分`, {
        fontSize: '20px', fill: '#333', fontFamily: 'Ma Shan Zheng'
      }).setOrigin(0.5).setDepth(201);
    items.push(txt);
  });
  let closeBtn = scene.add.text(scene.cameras.main.width/2, y+200, '关闭', {
    fontSize: '18px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setDepth(201).setInteractive();
  closeBtn.on('pointerdown', () => {
    bg.destroy(); title.destroy(); closeBtn.destroy();
    items.forEach(t=>t.destroy());
  });
}