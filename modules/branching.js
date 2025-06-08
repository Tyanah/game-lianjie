/**
 * 判断是否进入某剧情分支
 * @param {string} branchId
 * @returns {boolean}
 */
export function checkBranch(branchId) {
  const gs = window.gameState;
  switch (branchId) {
    case 'leaderPraise':
      return gs.npcFavor && gs.npcFavor.leader > 60 && gs.stats.integrity > 70;
    case 'hiddenEnding':
      return gs.stats.integrity < 30;
    case 'easterEgg':
      return gs.stats.integrity >= 90 && gs.stats.reputation >= 80;
    case 'badEnding':
      return gs.choices.scene1 && gs.choices.scene1.gift === 'accept' &&
             gs.choices.scene2 && gs.choices.scene2.learn === false;
    default:
      return false;
  }
}

/**
 * 获取当前结局类型
 * @returns {string} 结局key
 */
export function getEndingType() {
  if (checkBranch('easterEgg')) return 'easterEgg';
  if (checkBranch('badEnding')) return 'bad';
  if (checkBranch('hiddenEnding')) return 'hidden';
  return 'normal';
}

/**
 * 获取支线任务状态
 * @param {string} taskKey
 * @returns {string} 状态
 */
export function getTaskStatus(taskKey) {
  const tasks = window.gameState.tasks || [];
  const found = tasks.find(t => t.key === taskKey);
  return found ? found.status : 'not_started';
}

/**
 * 设置支线任务状态
 * @param {string} taskKey
 * @param {string} status
 */
export function setTaskStatus(taskKey, status) {
  if (!window.gameState.tasks) window.gameState.tasks = [];
  let found = window.gameState.tasks.find(t => t.key === taskKey);
  if (found) {
    found.status = status;
  } else {
    window.gameState.tasks.push({ key: taskKey, status });
  }
  window.saveState();
}