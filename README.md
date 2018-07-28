# jeu

a small 2d game framework based on choo.


## usage

```js
var jeu = require('jeu')

var game = jeu({
  load (done) {
    done()
  },
  update (delta) {

  },
  draw () {
    this.ctx.fillColor = 'black'
    this.ctx.fillRect(0, 0, 320, 240)
  }
})

game.mount('#game')

```

## api (so far)

`game.graphics`

`game.graphics.rectangle`
