var Scene = require('../classes/Scene')
var Layer = require('../classes/Layer')

var { Vector2, Box2 } = require('../classes/math')

class Background extends Layer {
  constructor () {
    super()
    this.box = Box2.from(new Vector2(0, 0), new Vector2(500, 500))
  }

  draw (ctx) {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.box.min.x, this.box.min.y, this.box.width, this.box.height)
  }
}
var size = new Vector2(800, 600)
var scene = new Scene(size)

scene.register(new Background())

module.exports = {
  currentScene: 'demo',
  scenes: {
    'demo': scene
  }
}
