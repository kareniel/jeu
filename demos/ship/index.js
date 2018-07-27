var jeu = require('jeu')

var game = jeu({
  load (done) {
    done()
  },

  update (delta) {

  },

  draw () {

  }
})

var el = document.createElement('div')

document.body.appendChild(el)

game.mount(el)
