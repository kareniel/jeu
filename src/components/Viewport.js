var Component = require('choo/component')
var html = require('choo/html')

module.exports = class Viewport extends Component {
  constructor (id, state, emit, game) {
    super()

    this.game = game
    this.menuIsToggled = false
  }

  createElement () {
    this.el = html`<canvas width="320" height="240"></canvas>`

    return this.el
  }

  update (state) {
    if (state.jeu.menu.toggled !== this.menuIsToggled) {
      this.togglePaused(state.jeu.menu.toggled)
    }

    this.menuIsToggled = state.jeu.menu.toggled

    return false
  }

  togglePaused (toggled) {
    return toggled
      ? this.game.pause()
      : this.game.resume()
  }
}
