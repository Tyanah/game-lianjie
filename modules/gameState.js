window.gameState = {
  player: { name: '张明', avatar: 'avatar1.png' },
  choices: { scene1: {}, scene2: {}, scene3: {} },
  stats: {
    integrity: 50,   // 廉洁值
    reputation: 30,  // 声望值
    wisdom: 20,      // 智慧
    courage: 20      // 勇气
  },
  npcFavor: { father: 50, colleague: 30, leader: 20 },
  achievements: {},
  ending: '',
  tasks: []
};

window.saveState = function() {
  localStorage.setItem('cleanCultureGameState', JSON.stringify(window.gameState));
};
window.loadState = function() {
  const saved = localStorage.getItem('cleanCultureGameState');
  if (saved) Object.assign(window.gameState, JSON.parse(saved));
};
window.loadState();