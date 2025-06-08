/**
 * 答题小游戏
 */
export function showQuizGame(scene, onComplete) {
  const questions = [
    {
      q: '遇到有人送你贵重礼物，你应该怎么做？',
      options: [
        { text: 'A. 礼貌拒绝并说明原因', correct: true },
        { text: 'B. 收下礼物，事后归还', correct: false },
        { text: 'C. 不理睬，假装没看到', correct: false }
      ]
    },
    {
      q: '下列哪项属于廉洁自律的表现？',
      options: [
        { text: 'A. 公私分明，秉公用权', correct: true },
        { text: 'B. 收受礼品但不声张', correct: false },
        { text: 'C. 利用职权为亲友谋利', correct: false }
      ]
    },
    {
      q: '发现同事存在违纪行为，你应该？',
      options: [
        { text: 'A. 主动报告相关部门', correct: true },
        { text: 'B. 视而不见', correct: false },
        { text: 'C. 帮助隐瞒', correct: false }
      ]
    },
    {
      q: '下列哪项做法是正确的？',
      options: [
        { text: 'A. 用公款请客送礼', correct: false },
        { text: 'B. 坚持原则，拒绝违规请求', correct: true },
        { text: 'C. 接受回扣作为辛苦费', correct: false }
      ]
    },
    {
      q: '面对诱惑时，最重要的是？',
      options: [
        { text: 'A. 坚守底线，遵守纪律', correct: true },
        { text: 'B. 随大流', correct: false },
        { text: 'C. 只要没人发现就行', correct: false }
      ]
    }
  ];
  let current = 0, score = 0, quizBtns = [];
  const dialogCenterX = scene.cameras.main.width/2;
  const dialogCenterY = scene.cameras.main.height/2;
  let dialogText = scene.add.text(dialogCenterX, dialogCenterY-60, '', {
    fontSize: '15px', fill: '#fff', fontFamily: 'Ma Shan Zheng', align: 'center', wordWrap: { width: 320 }
  }).setOrigin(0.5).setDepth(120);

  function cleanup() {
    quizBtns.forEach(b => b && b.destroy && b.destroy());
    quizBtns = [];
    dialogText && dialogText.destroy && dialogText.destroy();
  }

  function showQuestion(idx) {
    dialogText.setText(`【廉洁知识闯关】\n${questions[idx].q}`);
    quizBtns.forEach(b=>b.destroy());
    quizBtns = [];
    questions[idx].options.forEach((opt, i) => {
      let btn = scene.add.text(dialogCenterX, dialogCenterY+10+i*54, opt.text, {
        fontSize: '15px', fill: '#fff', backgroundColor: '#1e90ff', padding: { x: 24, y: 12 }, borderRadius: 18,
        fontFamily: 'Ma Shan Zheng', align: 'center'
      }).setOrigin(0.5).setDepth(121).setInteractive();
      quizBtns.push(btn);
      btn.on('pointerdown', () => {
        quizBtns.forEach(b=>b.destroy());
        if(opt.correct) score += 1;
        if(idx < questions.length-1) {
          dialogText.setText('已记录，进入下一题...');
          setTimeout(() => showQuestion(idx+1), 800);
        } else {
          let msg = `闯关完成！本次答对${score}题。`;
          dialogText.setText(msg);
          setTimeout(() => {
            dialogText.destroy();
            if (onComplete) onComplete(score);
          }, 1200);
        }
      });
      btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#00bfff', scale: 1.06 }));
      btn.on('pointerout', () => btn.setStyle({ backgroundColor: '#1e90ff', scale: 1 }));
    });
  }
  showQuestion(0);
}

/**
 * 找茬小游戏（简化版，点击错误点）
 */
export function showFindDifferenceGame(scene, onComplete) {
  let score = 0, total = 3;
  let dialogCenterX = scene.cameras.main.width/2;
  let dialogCenterY = scene.cameras.main.height/2;
  // 背景和图片
  let bg = scene.add.rectangle(dialogCenterX, dialogCenterY, 320, 200, 0xf0f8ff, 0.98).setDepth(120);
  let img = scene.add.image(dialogCenterX, dialogCenterY, 'office_diff').setScale(0.5).setDepth(121);
  let txt = scene.add.text(dialogCenterX, dialogCenterY-80, '请找出图片中的3处异常', {
    fontSize: '20px', fill: '#1e90ff', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(122);

  // 推荐：将异常点坐标放在图片细节处（举例）
  const points = [
    { x: dialogCenterX - 48, y: dialogCenterY - 22 },
    { x: dialogCenterX + 36, y: dialogCenterY + 18 },
    { x: dialogCenterX - 10, y: dialogCenterY + 52 }
  ];
  // 也可随机微调
  points.forEach(p => {
    p.x += (Math.random()-0.5)*10;
    p.y += (Math.random()-0.5)*10;
  });

  let found = [false, false, false];
  let covers = points.map((p, i) => {
    // 更小、更淡的异常点
    let c = scene.add.circle(p.x, p.y, 8, 0xcccccc, 0.3)
      .setDepth(123)
      .setInteractive({ useHandCursor: true });
    c.on('pointerdown', () => {
      if (!found[i]) {
        found[i] = true;
        c.setFillStyle(0x00ff88, 0.5);
        c.disableInteractive();
        score++;
        if (score === total) {
          txt.setText('全部找对！');
          setTimeout(() => {
            [bg, img, txt, ...covers].forEach(o=>o.destroy());
            if (onComplete) onComplete(score);
          }, 1000);
        }
      }
    });
    return c;
  });
}

/**
 * 拖拽排序小游戏
 */
export function showDragSortGame(scene, onComplete) {

  const dialogCenterX = scene.cameras.main.width / 2;
  const dialogCenterY = scene.cameras.main.height / 2;
if (scene.dialogBoxGfx && scene.showDialogBox) {
    scene.showDialogBox(1.5); // 1.5 表示高度放大1.5倍
  }
  // 游戏介绍
  let intro = scene.add.text(dialogCenterX, dialogCenterY - 90,
    '请将下方行为拖入对应区域\n左侧为“廉洁行为”，右侧为“不廉洁行为”',
    {
      fontSize: '15px',
      fill: '#fff',
      fontWeight: 'bold',
      fontFamily: 'Ma Shan Zheng',
      align: 'center',
      wordWrap: { width: 220 }
    }
  ).setOrigin(0.5).setDepth(230);

  // 区域参数（更小更紧凑）
  const areaY = dialogCenterY + 50;
  const areaW = 80, areaH = 54;
  const areaGap = 48;

  // 左侧目标区
  let area1 = scene.add.rectangle(
    dialogCenterX - areaW - areaGap / 2, areaY, areaW, areaH, 0xffffff, 0.18
  ).setStrokeStyle(3, 0x1e90ff, 1).setDepth(120);
  scene.add.text(area1.x, area1.y - areaH / 2 + 10, '廉洁行为', {
    fontSize: '13px', fill: '#1e90ff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(121);

  // 右侧目标区
  let area2 = scene.add.rectangle(
    dialogCenterX + areaW + areaGap / 2, areaY, areaW, areaH, 0xffffff, 0.18
  ).setStrokeStyle(3, 0xff8888, 1).setDepth(120);
  scene.add.text(area2.x, area2.y - areaH / 2 + 10, '不廉洁行为', {
    fontSize: '13px', fill: '#ff8888', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng'
  }).setOrigin(0.5).setDepth(121);

  // 区域图标
  scene.add.image(area1.x, area1.y + areaH / 2 + 8, 'awardMedal')
    .setScale(0.08).setAlpha(0.7).setDepth(122);
  //scene.add.image(area2.x, area2.y + areaH / 2 + 8, 'office')
    //.setScale(0.06).setAlpha(0.7).setDepth(122);

  // 拖拽选项（更小卡片，自动居中分布）
  let items = [
    { text: '拒绝回扣', correct: 1 },
    { text: '收受礼品', correct: 2 },
    { text: '主动报告问题', correct: 1 },
    { text: '利用职权谋私利', correct: 2 }
  ].sort(() => Math.random() - 0.5);

  // 选项参数
  const optionY = dialogCenterY - 38;
  const optionGapX = 90;
  const optionGapY = 38;
  const optionW = 78, optionH = 28;

  let draggables = items.map((item, i) => {
    let row = Math.floor(i / 2);
    let col = i % 2;
    let t = scene.add.rectangle(
      dialogCenterX - optionGapX / 2 + col * optionGapX,
      optionY + row * optionGapY,
      optionW, optionH, 0xffffff, 0.97
    ).setStrokeStyle(2, 0x1e90ff, 1).setDepth(123).setInteractive({ draggable: true });

    let txt = scene.add.text(t.x, t.y, item.text, {
      fontSize: '12px',
      fill: '#1e90ff',
      fontFamily: 'Ma Shan Zheng',
      align: 'center'
    }).setOrigin(0.5).setDepth(124);

    t.setData('correct', item.correct);
    t.setData('txt', txt);
    t.defaultX = t.x;
    t.defaultY = t.y;
    scene.input.setDraggable(t);

    // 鼠标悬停效果
    t.on('pointerover', () => t.setFillStyle(0xe0f7fa, 1));
    t.on('pointerout', () => t.setFillStyle(0xffffff, 0.97));

    return t;
  });

  // 拖拽逻辑
  let correct = 0;
  scene.input.on('dragstart', (pointer, gameObject) => {
    gameObject.setAlpha(0.85);
    gameObject.setScale(1.08);
    gameObject.getData('txt').setAlpha(0.85);
    intro && intro.destroy();
  });
  scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    gameObject.x = dragX;
    gameObject.y = dragY;
    gameObject.getData('txt').x = dragX;
    gameObject.getData('txt').y = dragY;
    // 高亮目标区
    let inArea1 = Phaser.Geom.Rectangle.Contains(area1.getBounds(), dragX, dragY);
    let inArea2 = Phaser.Geom.Rectangle.Contains(area2.getBounds(), dragX, dragY);
    area1.setFillStyle(0x1e90ff, inArea1 ? 0.28 : 0.18);
    area2.setFillStyle(0xff8888, inArea2 ? 0.28 : 0.18);
  });
  scene.input.on('dragend', (pointer, gameObject) => {
    gameObject.setAlpha(1);
    gameObject.setScale(1);
    gameObject.getData('txt').setAlpha(1);
    area1.setFillStyle(0x1e90ff, 0.18);
    area2.setFillStyle(0xff8888, 0.18);
    let inArea1 = Phaser.Geom.Rectangle.Contains(area1.getBounds(), gameObject.x, gameObject.y);
    let inArea2 = Phaser.Geom.Rectangle.Contains(area2.getBounds(), gameObject.x, gameObject.y);
    let answer = (inArea1 ? 1 : (inArea2 ? 2 : 0));
    if (answer === gameObject.getData('correct')) {
      // 吸附到目标区
      if (answer === 1) {
        gameObject.x = area1.x;
        gameObject.y = area1.y;
        gameObject.setFillStyle(0x1e90ff, 0.22);
        gameObject.getData('txt').x = area1.x;
        gameObject.getData('txt').y = area1.y;
        gameObject.getData('txt').setFill('#fff');
      }
      if (answer === 2) {
        gameObject.x = area2.x;
        gameObject.y = area2.y;
        gameObject.setFillStyle(0xff8888, 0.22);
        gameObject.getData('txt').x = area2.x;
        gameObject.getData('txt').y = area2.y;
        gameObject.getData('txt').setFill('#fff');
      }
      gameObject.disableInteractive();
      correct++;
    } else if (answer !== 0) {
      // 拖错，红色闪烁后回位
      gameObject.setFillStyle(0xff0000, 0.7);
      gameObject.getData('txt').setFill('#fff');
      scene.time.delayedCall(400, () => {
        gameObject.setFillStyle(0xffffff, 0.97);
        gameObject.getData('txt').setFill('#1e90ff');
        gameObject.x = gameObject.defaultX;
        gameObject.y = gameObject.defaultY;
        gameObject.getData('txt').x = gameObject.defaultX;
        gameObject.getData('txt').y = gameObject.defaultY;
      });
    } else {
      // 未拖到目标区，回位
      gameObject.x = gameObject.defaultX;
      gameObject.y = gameObject.defaultY;
      gameObject.getData('txt').x = gameObject.defaultX;
      gameObject.getData('txt').y = gameObject.defaultY;
    }
    if (correct === items.length) {
      scene.time.delayedCall(500, () => {
        [area1, area2, ...draggables].forEach(o => o && o.destroy && o.destroy());
        draggables.forEach(t => {
          const txt = t.getData('txt');
          if (txt && !txt.destroyed) txt.destroy();
        });
        if (onComplete) onComplete(true);
      });
    }
  });
}


/**
 * 连连看小游戏（如需用在第二幕，直接调用 showLinkGame）
 */
export function showLinkGame(scene, onComplete) {
  const dialogCenterX = scene.cameras.main.width / 2;
  const dialogCenterY = scene.cameras.main.height / 2;
  let intro = scene.add.text(dialogCenterX, dialogCenterY - 110, 
    '【连连看】请配对所有相同的图标', 
    { fontSize: '18px', fill: '#fff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng', align: 'center' }
  ).setOrigin(0.5).setDepth(120);
if (scene.dialogBoxGfx && scene.showDialogBox) {
    scene.showDialogBox(1.5); // 1.5 表示高度放大1.5倍
  }
  // 竖向排列，3列4行
  const icons = ['礼', '家', '医', '电', '书', '友'];
  let pairs = icons.concat(icons).sort(() => Math.random() - 0.5); // 12个
  let btns = [];
  let selected = [], matched = [];
  let cols = 3, rows = 4;
  let btnW = 44, btnH = 44, gapX = 18, gapY = 18;
  let startX = dialogCenterX - ((cols - 1) * (btnW + gapX)) / 2;
  let startY = dialogCenterY - 55;

  for (let i = 0; i < pairs.length; i++) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    let btn = scene.add.text(
      startX + col * (btnW + gapX),
      startY + row * (btnH + gapY),
      pairs[i],
      {
        fontSize: '22px',
        fill: '#fff',
        backgroundColor: '#1e90ff',
        padding: { x: 10, y: 6 },
        borderRadius: 10,
        fontFamily: 'Ma Shan Zheng',
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(121).setInteractive();
    btns.push(btn);

    btn.on('pointerdown', () => {
      if (matched.includes(i) || selected.length === 2 || selected.some(sel => sel.idx === i)) return;
      btn.setStyle({ backgroundColor: '#00bfff' });
      selected.push({ idx: i, icon: pairs[i] });

      if (selected.length === 2) {
        if (selected[0].icon === selected[1].icon && selected[0].idx !== selected[1].idx) {
          matched.push(selected[0].idx, selected[1].idx);
          btns[selected[0].idx].setStyle({ backgroundColor: '#00cc66' });
          btns[selected[1].idx].setStyle({ backgroundColor: '#00cc66' });
          selected = [];
          if (matched.length === pairs.length) {
            setTimeout(() => {
              btns.forEach(b => b.destroy());
              intro.destroy();
              if (onComplete) onComplete(true);
            }, 800);
          }
        } else {
          scene.time.delayedCall(500, () => {
            btns[selected[0].idx].setStyle({ backgroundColor: '#1e90ff' });
            btns[selected[1].idx].setStyle({ backgroundColor: '#1e90ff' });
            selected = [];
          });
        }
      }
    });
  }
}

export function showMemoryGame(scene, onComplete) {
  const dialogCenterX = scene.cameras.main.width / 2;
  const dialogCenterY = scene.cameras.main.height / 2;
  let intro = scene.add.text(dialogCenterX, dialogCenterY - 110, 
    '【记忆翻牌】请翻开两张相同的牌完成配对', 
    { fontSize: '18px', fill: '#fff', fontWeight: 'bold', fontFamily: 'Ma Shan Zheng', align: 'center' }
  ).setOrigin(0.5).setDepth(120);
  if (scene.dialogBoxGfx && scene.showDialogBox) {
    scene.showDialogBox(1.5);
  }
  // 横向排列，4列3行，共12张
  const icons = ['礼', '家', '医', '电', '书', '友']; // 6种
  let cards = icons.concat(icons).sort(() => Math.random() - 0.5); // 12张
  let cardObjs = [];
  let selected = [];
  let matched = [];
  let rows = 3, cols = 4;
  let cardW = 44, cardH = 60, gapX = 18, gapY = 18;
  let startX = dialogCenterX - ((cols - 1) * (cardW + gapX)) / 2;
  let startY = dialogCenterY - 40;

  for (let i = 0; i < cards.length; i++) {
    let row = Math.floor(i / cols);
    let col = i % cols;
    let card = scene.add.rectangle(
      startX + col * (cardW + gapX),
      startY + row * (cardH + gapY),
      cardW, cardH, 0xffffff, 0.95
    ).setStrokeStyle(3, 0x1e90ff, 1).setDepth(121).setInteractive();
    card.cardIdx = i;
    card.flipped = false;
    card.icon = cards[i];
    card.textObj = scene.add.text(card.x, card.y, '', {
      fontSize: '22px', fill: '#222', fontFamily: 'Ma Shan Zheng', fontWeight: 'bold'
    }).setOrigin(0.5).setDepth(122);
    cardObjs.push(card);

    card.on('pointerdown', () => {
      if (card.flipped || selected.length === 2 || matched.includes(i)) return;
      card.flipped = true;
      card.setFillStyle(0x1e90ff, 0.15);
      card.textObj.setText(card.icon);
      card.textObj.setStyle({ fill: '#222' });
      selected.push(card);

      if (selected.length === 2) {
        if (selected[0].icon === selected[1].icon) {
          matched.push(selected[0].cardIdx, selected[1].cardIdx);
          selected[0].setStrokeStyle(3, 0x00cc66, 1);
          selected[1].setStrokeStyle(3, 0x00cc66, 1);
          selected = [];
          if (matched.length === cards.length) {
            setTimeout(() => {
              cardObjs.forEach(c => { c.destroy(); c.textObj.destroy(); });
              intro.destroy();
              if (onComplete) onComplete(true);
            }, 800);
          }
        } else {
          scene.time.delayedCall(500, () => {
            selected.forEach(card => {
              card.flipped = false;
              card.setFillStyle(0xffffff, 0.95);
              card.setStrokeStyle(3, 0x1e90ff, 1);
              card.textObj.setText('');
              card.textObj.setStyle({ fill: '#1e90ff' });
            });
            selected = [];
          });
        }
      }
    });
  }
}