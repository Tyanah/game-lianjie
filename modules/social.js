/**
 * 生成结局分享卡片
 * @param {string} endingText
 * @param {string} bonusText
 * @param {number} integrity
 * @param {number} reputation
 * @param {string} avatar
 * @param {string} playerName
 * @param {string[]} achievements
 */
export function generateShareCard(endingText, bonusText, integrity, reputation, avatar, playerName, achievements=[]) {
  const w = 420, h = 340;
  let canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  let ctx = canvas.getContext('2d');
  ctx.fillStyle = '#e6f7ff'; ctx.fillRect(0, 0, w, h);

  // 头像
  if (avatar) {
    let img = new window.Image();
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(60, 60, 36, 0, Math.PI*2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, 24, 24, 72, 72);
      ctx.restore();
      drawRest();
    };
    img.src = avatar;
  } else {
    drawRest();
  }

  function drawRest() {
    ctx.fillStyle = '#1e90ff'; ctx.font = 'bold 26px "Ma Shan Zheng", cursive';
    ctx.textAlign = 'center';
    ctx.fillText('我的廉洁结局', w/2, 48);
    ctx.fillStyle = '#333'; ctx.font = '20px "Ma Shan Zheng", cursive';
    ctx.fillText(endingText, w/2, 100);
    if (bonusText) {
      ctx.fillStyle = '#00bfff';
      ctx.font = '18px "Ma Shan Zheng", cursive';
      ctx.fillText(bonusText, w/2, 140);
    }
    ctx.fillStyle = '#555'; ctx.font = '18px "Ma Shan Zheng", cursive';
    ctx.fillText(`廉洁值：${integrity}    声望值：${reputation}`, w/2, 190);
    ctx.font = '16px "Ma Shan Zheng", cursive'; ctx.fillStyle = '#888';
    ctx.fillText('—— 廉洁文化互动漫画', w/2, h-36);

    // 玩家名和成就
    ctx.font = '16px "Ma Shan Zheng", cursive'; ctx.fillStyle = '#1e90ff';
    ctx.fillText(playerName ? `玩家：${playerName}` : '', w/2, 230);
    if (achievements && achievements.length) {
      ctx.font = '14px "Ma Shan Zheng", cursive'; ctx.fillStyle = '#e67e22';
      ctx.fillText('成就：' + achievements.join('、'), w/2, 260);
    }

    let imgUrl = canvas.toDataURL('image/png');
    let img = document.createElement('img');
    img.src = imgUrl; img.style.display = 'block'; img.style.margin = '20px auto'; img.style.maxWidth = '90%'; img.style.borderRadius = '18px';
    document.body.appendChild(img);

    let saveBtn = document.createElement('button');
    saveBtn.innerText = '保存到本地/分享朋友圈';
    saveBtn.style.display = 'block'; saveBtn.style.margin = '10px auto'; saveBtn.style.padding = '10px 24px';
    saveBtn.style.background = 'linear-gradient(90deg,#00bfff,#1e90ff)';
    saveBtn.style.color = '#fff'; saveBtn.style.fontSize = '18px'; saveBtn.style.border = 'none'; saveBtn.style.borderRadius = '16px'; saveBtn.style.cursor = 'pointer';
    document.body.appendChild(saveBtn);

    saveBtn.onclick = function() {
      let a = document.createElement('a');
      a.href = imgUrl; a.download = '廉洁结局分享卡片.png'; a.click();
    };

    let tip = document.createElement('div');
    tip.innerText = '长按图片可保存或分享到朋友圈/社交平台';
    tip.style.textAlign = 'center'; tip.style.color = '#888'; tip.style.marginBottom = '24px';
    document.body.appendChild(tip);
  }
}

/**
 * 本地排行榜（支持多维度，按廉洁值、声望、成就数排序）
 */
export function updateLocalRank(playerName, integrity, reputation, ending, avatar, achievements=[]) {
  let ranks = JSON.parse(localStorage.getItem('cleanCultureRanks') || '[]');
  // 只保留每个玩家最高分
  let exist = ranks.find(r => r.name === playerName);
  let score = integrity*1000 + reputation*10 + (achievements.length||0)*100;
  if (exist) {
    let existScore = exist.integrity*1000 + exist.reputation*10 + ((exist.achievements && exist.achievements.length) ? exist.achievements.length : 0)*100;
    if (score > existScore) {
      exist.integrity = integrity;
      exist.reputation = reputation;
      exist.ending = ending;
      exist.avatar = avatar;
      exist.achievements = achievements;
      exist.time = Date.now();
    }
  } else {
    ranks.push({ name: playerName, integrity, reputation, ending, avatar, achievements, time: Date.now() });
  }
  // 排序并只保留前10
  ranks = ranks.sort((a, b) => {
    let sa = a.integrity*1000 + a.reputation*10 + ((a.achievements && a.achievements.length) ? a.achievements.length : 0)*100;
let sb = b.integrity*1000 + b.reputation*10 + ((b.achievements && b.achievements.length) ? b.achievements.length : 0)*100;
    return sb - sa;
  }).slice(0, 10);
  localStorage.setItem('cleanCultureRanks', JSON.stringify(ranks));
}

/**
 * 展示排行榜
 */
export function showLocalRankPanel(scene) {
  let ranks = JSON.parse(localStorage.getItem('cleanCultureRanks') || '[]');
  let y = 80;
  let bg = scene.add.rectangle(scene.cameras.main.width/2, y+140, 480, 380, 0xffffff, 0.98).setDepth(200);
  let title = scene.add.text(scene.cameras.main.width/2, y, '排行榜', {
    fontSize: '28px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(201);

  let items = [];
  if (ranks.length === 0) {
    items.push(scene.add.text(scene.cameras.main.width/2, y+60, '暂无数据', {
      fontSize: '18px', fill: '#888', fontFamily: 'Ma Shan Zheng'
    }).setOrigin(0.5).setDepth(201));
  } else {
    ranks.forEach((r, i) => {
      let txt = scene.add.text(scene.cameras.main.width/2, y+40+i*36,
  `${i+1}. ${r.name}  廉洁值:${r.integrity} 声望:${r.reputation} 成就:${(r.achievements && r.achievements.length) ? r.achievements.length : 0} 结局:${r.ending||''}  ${new Date(r.time).toLocaleDateString()}`,
  {
    fontSize: '18px', fill: i === 0 ? '#e67e22' : '#333', fontFamily: 'Ma Shan Zheng'
  }
).setOrigin(0.5).setDepth(201);
      items.push(txt);
    });
  }
  let closeBtn = scene.add.text(scene.cameras.main.width/2, y+320, '关闭', {
    fontSize: '18px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 18, y: 8 }
  }).setOrigin(0.5).setDepth(201).setInteractive();
  closeBtn.on('pointerdown', () => {
    bg.destroy(); title.destroy(); closeBtn.destroy();
    items.forEach(t=>t.destroy());
  });
}
export function showLocalRankPanelForWeb() {
  let ranks = JSON.parse(localStorage.getItem('cleanCultureRanks') || '[]');
  const html = `<div id="rankPanelMask" style="position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
    <div style="background:#fff;border-radius:18px;padding:2rem;min-width:320px;max-width:90vw;">
      <h2 style="color:#1e90ff;">排行榜</h2>
      <ul style="padding:0 1rem;max-height:320px;overflow:auto;">${
        ranks.length === 0
          ? `<li style="color:#888;">暂无数据</li>`
          : ranks.map((r, i) =>
            `<li style="margin:0.5rem 0;color:${i===0?'#e67e22':'#1e90ff'};">
  ${i+1}. ${r.name} 廉洁值:${r.integrity} 声望:${r.reputation} 成就:${(r.achievements && r.achievements.length) ? r.achievements.length : 0} 结局:${r.ending||''} ${new Date(r.time).toLocaleDateString()}
</li>`
          ).join('')
      }</ul>
      <button onclick="document.getElementById('rankPanelMask').remove()" style="margin-top:1rem;">关闭</button>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}