var choo = require('choo')
var html = require('choo/html')
var sheetify = require('sheetify')

var { Game } = require('./engine')
var demo = require('./demo')

var app = choo()
var game = new Game()

sheetify('tachyons')

game.on('load', () => game.start(demo))
app.route('/', (state, emit) => html`<body class="overflow-hidden">${game.render()}</body>`)
app.mount('body')
