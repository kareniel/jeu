var Scene = require('../classes/Scene')
var Layer = require('../classes/Layer')

var { Vector2, Box2 } = require('../classes/math')

class Background extends Layer {
  constructor () {
    super()

    this.box = new Box2(new Vector2(0, 0), new Vector2(1000, 1000))
    this.corner = new Vector2()
  }

  draw (ctx, viewport) {
    if (!viewport.intersectsBox(this.box)) return

    this.corner.copy(this.box.min).sub(viewport.min)

    ctx.fillStyle = 'blue'
    ctx.fillRect(this.corner.x, this.corner.y, this.box.width, this.box.height)
  }
}

var scene = new Scene()

scene.register(new Background())

module.exports = {
  currentScene: 'demo',
  scenes: {
    'demo': scene
  }
}
