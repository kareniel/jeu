var Component = require('choo/component')
var html = require('choo/html')

class DefaultMenu extends Component {
  update () { return false }
  createElement () { return html`<div style="color: white;">menu</div>` }
}

module.exports = class MenuContainer extends Component {
  constructor (id, state, emit, MenuComponent) {
    super(id)

    this.component = MenuComponent ? new MenuComponent() : new DefaultMenu()
    this.toggled = false
  }

  createElement (state, emit) {
    this.toggled = state.jeu.menu.toggled

    var style = `
      opacity: ${this.toggled ? 1 : 0};
      position: absolute;
      top: 0;
      left: 0;`

    return html`
      <div style=${style}>
        ${this.component.render(state, emit)}
      </div>`
  }

  update (state) {
    return state.jeu.menu.toggled !== this.toggled
  }
}
