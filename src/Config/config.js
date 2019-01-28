import 'phaser'

export default {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#2ecc71',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
}