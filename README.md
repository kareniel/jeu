# jeu

a small 2d game framework based on choo.


## usage

```js
var jeu = require('jeu')

var Menu = require('./components/Menu')

var game = jeu({
  ui: {
    Menu: Menu
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

```
