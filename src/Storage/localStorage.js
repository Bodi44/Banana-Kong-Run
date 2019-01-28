import 'phaser'

const gameData = (localStorage.getItem('gameData')) ? JSON.parse(localStorage.getItem('gameData')) : {
  currentScore: 0,
}

const updateGameData = () => {
  if (localStorage.getItem('gameData')) localStorage.removeItem('gameData')
  localStorage.setItem('gameData', JSON.stringify(gameData))
}

export { gameData, updateGameData }

