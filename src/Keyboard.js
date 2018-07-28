var { Vector2 } = require('three')
var { KEYS } = require('./constants')

class Keyboard {
  constructor (game) {
    this.game = game

    this._keys = new Set()
    this._direction = new Vector2()

    this._registerEvents()
  }

  isDown (key) {
    return this._keys.has(key)
  }

  getDirection () {
    if (this.isDown(KEYS.UP)) this._direction.setY(-1)
    if (this.isDown(KEYS.RIGHT)) this._direction.setX(1)
    if (this.isDown(KEYS.DOWN)) this._direction.setY(1)
    if (this.isDown(KEYS.LEFT)) this._direction.setX(-1)

    return this._direction
  }

  _registerEvents () {
    window.addEventListener('keydown', this._onKeyDown.bind(this))
    window.addEventListener('keyup', this._onKeyUp.bind(this))
  }

  _onKeyDown (e) {
    this._keys.add(Keyboard.KEYS[e.key] || e.key)
  }

  _onKeyUp (e) {
    this._keys.delete(Keyboard.KEYS[e.key] || e.key)
  }
}

Keyboard.KEYS = {
  w: 'UP',
  d: 'RIGHT',
  s: 'DOWN',
  a: 'LEFT',

  ArrowUp: 'UP',
  ArrowRight: 'RIGHT',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',

  Escape: 'CANCEL',
  Enter: 'CONFIRM'
}

module.exports = Keyboard
