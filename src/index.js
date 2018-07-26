var choo = require('choo')
var html = require('choo/html')
var devtools = require('choo-devtools')

var Game = require('./Game')
var MenuContainer = require('./components/MenuContainer')
var Viewport = require('./components/Viewport')

const { EVENTS } = require('./constants')

jeu.EVENTS = EVENTS

module.exports = jeu

function jeu (opts) {
  var app = choo()

  if (!opts.ui) opts.ui = {}

  if (process.env.NODE_ENV !== 'production') {
    app.use(devtools())
  }

  app.use(store)
  app.route('*', view)

  return app

  function view (state, emit) {
    var Menu = state.jeu.opts.ui.Menu

    return html`
      <div style="position: relative;">
        ${state.cache(MenuContainer, 'menu-container', Menu).render(state, emit)}
        ${state.cache(Viewport, 'viewport', state.jeu.game).render(state, emit)}
      </div>`
  }

  function store (state, emitter, app) {
    var game = new Game(state, emitter)

    game.load = opts.load
    game.update = opts.update
    game.draw = opts.draw

    state.jeu = {
      game: game,
      opts: opts,
      menu: {
        toggled: false
      }
    }

    emitter.on('DOMContentLoaded', () => {
      emitter.on(EVENTS.TOGGLE_MENU, toggleMenu)

      game.run(state.cache(Viewport, 'viewport').el)
    })

    function toggleMenu () {
      state.jeu.menu.toggled = !state.jeu.menu.toggled
      emitter.emit('render')
    }
  }
}
