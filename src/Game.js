const { EVENTS } = require('./constants')

module.exports = class Game {
  constructor (state, emitter) {
    this.__delta = 0
    this._previousElapsed = 0

    this.state = state
    this.emit = emitter.emit.bind(emitter)

    this.paused = false

    this.tick = this.tick.bind(this)
  }

  run (el) {
    this.el = el
    this.ctx = el.getContext('2d')

    this.load(this.onload.bind(this))
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

  pause () {
    this.paused = true

    this.emit(EVENTS.PAUSED)
  }

  resume () {
    this.paused = false

    this.emit(EVENTS.RESUMED)

    window.requestAnimationFrame(this.tick)
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
