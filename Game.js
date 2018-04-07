var html = require('choo/html')
var Nanocomponent = require('choo/component')
var nanobus = require('nanobus')

var Timer = require('./classes/Timer')
var { Vector2, Box2 } = require('./classes/math')
const { DIRECTION_MAP, ARROW_KEYS, KEY_MAP } = require('./constants')

var keyboard = {
  arrows: new Set()
}

var hero = {
  box: Box2.from(new Vector2(), new Vector2(24, 32)),
  sprite: {
    size: new Vector2(24, 48)
  },
  speed: 1,
  move (vector, speed = 1) {
    this._vector = vector.clone().multiplyScalar(speed)
    this.box.translate(this._vector)
  },
  update (game) {
    this.speed = game.keyboard.arrows.size > 1 ? 0.7 : 1

    game.keyboard.arrows.forEach(key => {
      this.move(DIRECTION_MAP[key], this.speed)
    })
  },

  draw (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.box.min.x, this.box.min.y, this.sprite.size.x, this.sprite.size.y)
  }
}

var viewport = {
  target: null,
  box: Box2.from(new Vector2(), new Vector2(800, 600)),

  follow (vector) {
    this.target = vector
  },

  update () {
    this.box.setFromCenterAndSize(this.box.getSize(), this.target)
  }
}

var loop = {
  start (game) {
    this.game = game
    this.timer = new Timer()

    this.update = this.update.bind(this)
    this.render = this.render.bind(this)

    this.timer.start()
    this.update()
  },
  update () {
    this.game.currentScene.update(this.game)
    this.game.hero.update(this.game)

    this.render()
  },
  render () {
    this.game.currentScene.draw(this.game.ctx)
    this.game.hero.draw(this.game.ctx)

    window.requestAnimationFrame(this.update)
  }
}

class Game extends Nanocomponent {
  constructor () {
    super()

    this.emitter = nanobus()
    this.on = this.emitter.on.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)

    this.hero = hero
    this.viewport = viewport
    this.keyboard = keyboard
    this.loop = loop

    this.currentScene = null
    this.scenes = {}
  }

  createElement () {
    return html`<canvas width="800" height="600"></canvas>`
  }

  update () {
    return false
  }

  load (el) {
    this.el = el
    this.ctx = el.getContext('2d')
    this.emit('load')
  }

  start (data) {
    this.scenes = data.scenes
    this.currentScene = data.scenes[data.currentScene]

    document.addEventListener('keydown', e => {
      var key = KEY_MAP[e.key]
      if (ARROW_KEYS.includes(key)) this.keyboard.arrows.add(key)
    })

    document.addEventListener('keyup', e => {
      this.keyboard.arrows.delete(KEY_MAP[e.key])
    })

    this.loop.start(this)
  }
}

module.exports = Game
