import 'phaser'
import config from '../Config/config'
import { gameData, updateGameData } from '../Storage/localStorage'

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game')
    this.power = 0
    this.lost = false
    this._score = 0
    this.clickLock = false
  }

  preload() {
    this.load.image('platform', 'assets/platformGrassed.png')
    this.load.image('bar', 'assets/powerbar.png')
    this.load.image('banana', 'assets/banana.png')
    this.load.image('block', 'assets/block_wood.png')
    this.load.spritesheet('bird', 'assets/bird_texture.png', { frameWidth: 116, frameHeight: 80 })
    this.load.spritesheet('monkey', 'assets/monkeywalk.png', { frameWidth: 110.5, frameHeight: 155 })
    this.load.multiatlas('junglescene', 'assets/junglescene.json', 'assets')
  }

  createPlatforms() {
    this._platform = this.physics.add.staticGroup()
    this._platform.create(400, 568, 'platform').setScale(2).refreshBody()
  }

  createPlayer() {
    this._player = this.physics.add.sprite(100, 450, 'monkey')
    this._player.setScale(0.5, 0.5)
    this._player.setBounce(0.2)
    this._player.setCollideWorldBounds(true)
    this._player.body.setGravityY(300)

    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('monkey', { start: 0, end: 8 }),
      frameRate: 10,
      repeat: -1,
    })

    this._player.anims.play('walk')
  }

  playerJump() {
    this._player.setVelocityY(-this.power * 11)
  }

  create() {
    this.add.sprite(0, 0, 'junglescene', 'jungle_background.png')
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontFamily: 'Arial', fontSize: '32px', fill: '#000' })

    this.createPlayer()
    this.createPlatforms()

    let powerBar = this.add.sprite(this._player.x, this._player.y, 'bar')
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
      key: 'banana',
      repeat: Phaser.Math.Between(1, 3),
      setXY: { x: config.width - 25, y: 500, stepX: 100 },
    })

    this.bananas.getChildren().forEach((banana) => {
      banana.setVelocityX(-150)
      banana.setScale(0.2, 0.2)
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
    this.bird.setScale(0.7, 0.7)
    this.anims.create({
      key: 'fly',
      frames: this.anims.generateFrameNames('bird', { start: 0, end: 8 }),
      frameRate: 12,
      repeat: -1,
    })
    this.bird.anims.play('fly')
    this.bird.scaleX = -this.bird.scaleX
  }

  collectBanana(player, banana) {
    this._score += 5
    this.scoreText.setText('Score: ' + this._score)
    banana.disableBody(true, true)
  }

  update() {
    this.physics.add.collider(this._player, this._platform)
    this.physics.add.collider(this._player, this.blocks, this.gameOver, null, this)
    this.physics.add.collider(this.blocks, this.blocks)
    this.physics.add.collider(this.blocks, this._platform)
    this.physics.add.collider(this._player, this.bird, this.gameOver, null, this)


    if (this.blocks.getChildren()[0].x === 500) {
      this.addBananas()
      this.physics.add.collider(this.bananas, this._platform)
      this.physics.add.overlap(this._player, this.bananas, this.collectBanana, null, this)
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

    gameData.currentScore = this._score
    updateGameData()
    this.add.text(
      config.width / 2 - 175, config.height / 2 - 100,
      `GAME OVER !`,
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        fill: '#000',
      },
    )

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        this.scene.start('GameOver')
      },
      loop: false,
    })
  }
}
