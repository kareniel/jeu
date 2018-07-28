class Gamepads {
  static from () {
    var gamepads = [].slice.call(navigator.getGamepads())

    return gamepads.map(gp => new Gamepad(this, gp))
  }
}

class Gamepad {
  constructor (gamepads, controller) {
    this.controller = controller
    this._keys = new Set()
    this._onConnect = this._onConnect.bind(this)
    this._onDisconnect = this._onDisconnect.bind(this)

    this._registerEvents()
  }

  isConnected () {
    return Boolean(this.controller)
  }

  isDown (key) {
    return this._keys.has(key)
  }

  _registerEvents () {
    if (!this.controller) {
      window.addEventListener('gamepadconnected', this._onConnect)
    }
  }

  _onConnect (e) {
    this.controller = e.gamepad

    window.addEventListener('gamepaddisconnected', this._onDisconnect)
    window.removeEventListener('gamepadconnected', this._onDisconnect)
  }

  _onDisconnect (e) {
    if (e.gamepad !== this.controller) return

    this.controller = null

    window.removeEventListener('gamepaddisconnected', this._onDisconnect)
  }

  _onKeyDown (e) {
    console.log(e.key)
    this._keys.add(Gamepad.KEYS[e.key] || e.key)
  }

  _onKeyUp (e) {
    this._keys.delete(Gamepad.KEYS[e.key] || e.key)
  }
}

Gamepad.KEYS = {
  '0': 'UP',
  '1': 'RIGHT',
  '2': 'DOWN',
  '3': 'LEFT',

  '4': 'CANCEL',
  '5': 'CONFIRM'
}

module.exports = Gamepads
