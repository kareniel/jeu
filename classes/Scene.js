var nanobus = require('nanobus')
var { Vector2, Box2 } = require('./math')
var { IDrawable, IUpdatable } = require('../interfaces')

class Scene extends nanobus {
  constructor () {
    super()

    this.box = Box2.from(new Vector2(0, 0), new Vector2(0, 0))
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

    console.log('position', component.box)

    this.box.union(component.box)

    console.log('size', this.box.getSize())
  }

  update (game) {
    this.state.components.updatable.forEach(component => component.update(game))
  }

  draw (ctx, viewport) {
    this.state.components.drawable.forEach(component => component.draw(ctx, viewport))
  }
}

module.exports = Scene
