module.exports = store

function store (state, emitter) {
  state.jeu = {
    menu: {
      toggled: false
    }
  }

  emitter.on('DOMContentLoaded', () => {
    emitter.on('jeu:toggle-menu', () => {
      state.jeu.menu.toggled = !state.jeu.menu.toggled
      emitter.emit('render')
    })

    game.run(viewport.ctx)
  })
}
