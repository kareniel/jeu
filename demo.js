var { Scene } = require('./engine')
var { Vector2, Box2 } = require('./math')

var background = {
  box: Box2.from(new Vector2(0, 0), new Vector2(500, 500)),
  draw (ctx) {
    ctx.fillStyle = 'black'
    ctx.fillRect(this.box.min.x, this.box.min.y, this.box.width, this.box.height)
  }
}

var components = [ background ]
var scene = new Scene(components)

module.exports = {
  scenes: {
    'demo': scene
  }
}
