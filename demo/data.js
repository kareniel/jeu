var Scene = require('../classes/Scene')
var Layer = require('../classes/Layer')

var { Vector2, Box2 } = require('../classes/math')

class Background extends Layer {
  constructor () {
    super()

    this.size = new Vector2(500, 500)
    this.position = new Vector2(400, 300)
    this.box = Box2.from(this.position, this.size)
    this.corner = new Vector2()
  }

  draw (ctx, viewport) {
    if (!viewport.intersectsBox(this.box)) return

    this.corner.copy(this.box.min).sub(viewport.min)

    ctx.fillStyle = 'blue'
    ctx.fillRect(this.corner.x, this.corner.y, this.size.x, this.size.y)
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
