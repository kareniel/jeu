var nanobus = require('nanobus')
var { Vector2 } = require('./math')
var { IDrawable, IUpdatable } = require('../interfaces')

var DEFAULT_SIZE = new Vector2(256, 256)

class Scene extends nanobus {
  constructor (size = DEFAULT_SIZE) {
    super()

    this.size = size
    this.state = {
      components: {
        drawable: [],
        updatable: []
      }
    }
  }

  register (component) {
    if (component instanceof IDrawable) this.state.components.drawable.push(component)
    if (component instanceof IUpdatable) this.state.components.updatable.push(component)
  }

  update (game) {
    this.state.components.updatable.forEach(component => component.update(game))
  }

  draw (ctx) {
    this.state.components.drawable.forEach(component => component.draw(ctx))
  }
}

module.exports = Scene
