import 'phaser'
import config from '../Config/config'

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  preload(){
    this.load.image('playAgain', 'assets/playAgain.png')
  }

  create() {
    this.playAgain = this.add.sprite(config.width / 2, config.height / 2, 'playAgain')
    this.playAgain.setInteractive()
    this.playAgain.on('pointerdown',
      (pointer) => GameOverScene.restart()
    )
  }

  static restart() {
    location.reload()
  }
}