var choo = require('choo')
var html = require('choo/html')
var sheetify = require('sheetify')

var jeu = require('../.')
var data = require('./data')

var app = choo()
var game = jeu()

sheetify('tachyons')

game.on('load', () => game.start(data))
app.route('*', (state, emit) => html`<body class="overflow-hidden">${game.render()}</body>`)
app.mount('body')
