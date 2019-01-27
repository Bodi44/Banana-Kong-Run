import 'phaser'

export default {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#00ffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
}