var choo = require('choo')
var html = require('choo/html')
var sheetify = require('sheetify')

var jeu = require('../.')
var data = require('./data')

var app = choo()
var game = jeu()

sheetify('tachyons')

game.on('load', () => game.start(data))
app.route('*', view)
app.mount('body')

function view (state, emit) {
  return html`
    <body class="overflow-hidden tc ma3">
      ${game.render()}
    </body>`
}
