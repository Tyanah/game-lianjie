// 全局游戏状态管理，支持自动存档、读档、重置
window.gameState = window.gameState || {
  player: { name: '张明', avatar: 'avatar1.png' },
  choices: {},
  stats: { integrity: 50, reputation: 30, wisdom: 20, courage: 20 },
  npcFavor: {},
  achievements: {},
  ending: '',
  tasks: []
};

window.loadState = function() {
  let state = localStorage.getItem('cleanCultureGameState');
  if (state) {
    window.gameState = JSON.parse(state);
  } else {
    window.gameState = {
      stats: { integrity: 20, reputation: 10, wisdom: 10, courage: 10 },
      player: { name: '', avatar: 'assets/avatar1.png' },
      achievements: {},
      collection: []
    };
  }
};
window.saveState = function() {
  localStorage.setItem('cleanCultureGameState', JSON.stringify(window.gameState));
};
window.resetState = function() {
  localStorage.removeItem('cleanCultureGameState');
  location.href = 'index.html';
};

// 支持多存档（可选，按需调用）
// window.saveStateAs = function(slot) {
//   localStorage.setItem('cleanCultureGameState_' + slot, JSON.stringify(window.gameState));
// };
// window.loadStateFrom = function(slot) {
//   const saved = localStorage.getItem('cleanCultureGameState_' + slot);
//   if (saved) Object.assign(window.gameState, JSON.parse(saved));
// };

window.loadState();