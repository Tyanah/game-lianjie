/**
 * 显示蓝色对话框
 */
export function showDialogBox(scene, x, y, w, h, r) {
  const gfx = scene.add.graphics({ x: 0, y: 0 }).setDepth(11);
  gfx.clear();
  gfx.fillStyle(0xffffff, 0.12);
  gfx.fillRoundedRect(x-w/2-8, y-h/2-8, w+16, h+16, r+8);
  gfx.fillStyle(0x1e90ff, 0.90);
  gfx.fillRoundedRect(x-w/2, y-h/2, w, h, r);
  gfx.lineStyle(8, 0x00ffff, 0.92);
  gfx.strokeRoundedRect(x-w/2, y-h/2, w, h, r);
  return gfx;
}

/**
 * 显示属性条
 */
export function showStatsBar(scene, stats) {
  let txt = scene.add.text(scene.cameras.main.width-160, 30,
    `廉洁值:${stats.integrity}\n声望:${stats.reputation}\n智慧:${stats.wisdom}\n勇气:${stats.courage}`,
    { fontSize: '18px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng' }
  ).setDepth(50);
  return txt;
}

/**
 * 弹出成就提示
 */
export function showAchievementToast(scene, text) {
  let toast = scene.add.text(scene.cameras.main.width/2, 80, text, {
    fontSize: '22px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setDepth(100);
  scene.tweens.add({ targets: toast, alpha: 0, duration: 1800, delay: 1200, onComplete: ()=>toast.destroy() });
}

/**
 * 通用弹窗
 */
export function showModal(scene, content, onClose) {
  let mask = scene.add.rectangle(scene.cameras.main.width/2, scene.cameras.main.height/2,
    scene.cameras.main.width, scene.cameras.main.height, 0x000000, 0.45).setDepth(200).setInteractive();
  let box = scene.add.graphics().setDepth(201);
  box.fillStyle(0xffffff, 0.98);
  box.fillRoundedRect(scene.cameras.main.width/2-180, scene.cameras.main.height/2-90, 360, 180, 30);
  let txt = scene.add.text(scene.cameras.main.width/2, scene.cameras.main.height/2, content, {
    fontSize: '22px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng', align: 'center', wordWrap: { width: 320 }
  }).setOrigin(0.5).setDepth(202);
  mask.on('pointerdown', () => {
    mask.destroy(); box.destroy(); txt.destroy();
    if (onClose) onClose();
  });
}