import 'phaser'
import config from '../Config/config'
import { gameData } from '../Storage/localStorage'

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  preload() {
    this.load.image('playAgain', 'assets/playAgain.png')
  }

  create() {
    this.add.sprite(0, 0, 'junglescene', 'jungle_background.png')
    this.add.text(
      config.width / 2 - 175, config.height / 2 - 75,
      `CURRENT SCORE: ${gameData.currentScore}`,
      {
        fontFamily: 'Arial',
        fontSize: '36px',
        fill: '#000',
      },
    )

    this.playAgain = this.add.sprite(config.width / 2, config.height / 2 + 10, 'playAgain')
    this.playAgain.setInteractive()
    this.playAgain.on('pointerdown',
      (pointer) => GameOverScene.restart(),
    )
  }

  static restart() {
    location.reload()
  }
}