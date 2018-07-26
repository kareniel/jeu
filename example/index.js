var jeu = require('../src')

var game = jeu({
  components: {
    menu: undefined
  },
  load () {
    return Promise.resolve()
  },

  update (delta) {

  },

  draw () {
    this.ctx.fillColor = 'black'
    this.ctx.fillRect(0, 0, 320, 240)
  }
})

game.use(store)
game.mount('#game')

function store (state, emitter) {
  emitter.on('DOMContentLoaded', () => {
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') emitter.emit(jeu.EVENTS.TOGGLE_MENU)
    })
  })
}
