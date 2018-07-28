const { EVENTS, KEYS } = require('./constants')

var Keyboard = require('./Keyboard')
var Gamepads = require('./Gamepads')
var Debugger = require('./Debugger')

class Game {
  constructor (state, emitter) {
    this.__delta = 0
    this._previousElapsed = 0

    this.state = state
    this.emit = emitter.emit.bind(emitter)

    this.paused = false

    this.tick = this.tick.bind(this)

    this.loadModules()
  }

  loadModules () {
    this.debugger = new Debugger(this)

    // input
    this.keyboard = new Keyboard()
    this.gamepads = Gamepads.from(navigator)
  }

  run (el) {
    this.el = el
    this.ctx = el.getContext('2d')

    this.init()
    this.load(() => this.onload())
  }

  onload () {
    this.emit(EVENTS.LOADED)
    window.requestAnimationFrame(this.tick)
  }

  tick (elapsed) {
    if (this.paused) return

    window.requestAnimationFrame(this.tick)

    this.__delta = (elapsed - this._previousElapsed) / 1000.0
    this.__delta = Math.min(this.__delta, 0.25)
    this._previousElapsed = elapsed

    this.update(this.__delta)
    this.draw()
  }

  clear () {
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.el.width, this.el.height)
  }

  pause () {
    this.paused = true

    this.emit(EVENTS.PAUSED)
  }

  resume () {
    this.paused = false

    this.emit(EVENTS.RESUMED)

    window.requestAnimationFrame(this.tick)
  }

  init () {
    throw new Error('jeu: init should be implemented!')
  }

  load () {
    throw new Error('jeu: load should be implemented!')
  }

  update (delta) {
    throw new Error('jeu: update should be implemented!')
  }

  draw () {
    throw new Error('jeu: draw should be implemented!')
  }
}

Game.EVENTS = EVENTS
Game.KEYS = KEYS

module.exports = Game
