import 'phaser'
import config from '../Config/config'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game')
    this.power = 0
    this.lost = false
    this._score = 0
    this.clickLock = false
  }

  preload() {
    this.load.image('platform', 'assets/platform.png')
    this.load.image('hero', 'assets/hero.png')
    this.load.image('bar', 'assets/powerbar.png')
    this.load.image('block', 'assets/block.png')
    this.load.image('bird', 'assets/bird.png')
    this.load.image('grass', 'assets/grass.png')
  }

  createPlatforms() {
    let platform = this.physics.add.staticGroup()
    platform.create(400, 568, 'platform').setScale(2).refreshBody()

    return platform
  }

  createPlayer() {
    let player = this.physics.add.sprite(100, 450, 'hero')
    player.setBounce(0.2)
    player.setCollideWorldBounds(true)
    player.body.setGravityY(300)

    return player
  }

  playerJump() {
    this._player.setVelocityY(-this.power * 11)
  }

  create() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' })
    this._player = this.createPlayer()
    this._playform = this.createPlatforms()
    let powerBar = this.add.sprite(this._player.x, this._player.y + 50, 'bar')
    powerBar.displayWidth = 0

    this.createNewWalls()
    this.addBird()

    let timer

    this.input.on('pointerdown', () => {
      if (this.clickLock === true)
        return

      timer = this.time.addEvent({
        delay: 10,
        callback: () => {
          this.power++
          powerBar.displayWidth = this.power
          if (this.power > 50) this.power = 50
        },
        loop: true,
      })
    })

    this.input.on('pointerup', () => {
      this.playerJump()
      timer.remove(false)
      this.power = 0
      powerBar.displayWidth = 0
    })

  }

  addBananas() {
    this.bananas = this.physics.add.group({
      key: 'hero',
      repeat: Phaser.Math.Between(1, 3),
      setXY: { x: config.width - 25, y: 500, stepX: 100 },
    })

    this.bananas.getChildren().forEach((banana) => {
      banana.setVelocityX(-150)
    })
  }

  createNewWalls() {
    if (this.blocks !== undefined)
      this.blocks.clear()

    this.blocks = this.physics.add.group({
      key: 'block',
      repeat: Phaser.Math.Between(1, 5),
      setXY: {
        x: config.width - 25,
        y: config.height - 88,
        stepY: -50,
      },
    })

    this.blocks.getChildren().forEach((block) => {
      block.setVelocityX(-150)
      block.setGravityY(4)
      block.setBounce(1, 1)
    })
  }

  addBird() {
    if (this.bird !== undefined)
      this.bird.disableBody(true, true)

    this.bird = this.physics.add.sprite(config.width, Phaser.Math.Between(50, 200), 'bird')
    this.bird.setVelocityX(-200)
    this.bird.setBounce(2, 2)
  }

  static collectBanana(player, banana) {
    this._score += 5
    this.scoreText.setText('Score: ' + this._score)
    banana.disableBody(true, true)
  }

  update() {
    this.physics.add.collider(this._player, this._playform)
    this.physics.add.collider(this._player, this.blocks, this.gameOver, null, this)
    this.physics.add.collider(this.blocks, this.blocks)
    this.physics.add.collider(this.blocks, this._playform)
    this.physics.add.collider(this._player, this.bird, this.gameOver, null, this)


    if (this.blocks.getChildren()[0].x === 500) {
      this.addBananas()
      this.physics.add.collider(this.bananas, this._playform)
      this.physics.add.overlap(this._player, this.bananas, GameScene.collectBanana, null, this)
    }

    if (this.lost === false && this.blocks.getChildren()[0].x === 100) {
      this._score += 10
      this.scoreText.setText('Score: ' + this._score)
    }

    if (this.blocks.getChildren()[0].x < 0)
      this.createNewWalls()

    if (this.bird.x < 0)
      this.addBird()

  }

  gameOver() {
    this.lost = true
    this.clickLock = true
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.scene.start('GameOver')
      },
      loop: false,
    })
  }
}
