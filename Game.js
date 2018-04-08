var html = require('choo/html')
var Nanocomponent = require('choo/component')
var nanobus = require('nanobus')
var assert = require('assert')

var Timer = require('./classes/Timer')
var { Vector2, Box2 } = require('./classes/math')
const { DIRECTION_MAP, ARROW_KEYS, KEY_MAP } = require('./constants')

var keyboard = {
  arrows: new Set()
}

var position = new Vector2(0, 0)
var size = new Vector2(24, 48)

var hero = {
  position: position,
  sprite: {
    size
  },
  corner: new Vector2(),
  box: new Box2(position, size),
  speed: 1,
  scene: null,
  move (vector, speed = 1) {
    this.box.translate(vector.clone().multiplyScalar(speed * 2.4))
    this.position.copy(this.box.min)
  },
  teleport (scene, position) {
    this.scene = scene

    this.box.setFromCenterAndSize(position, this.sprite.size)
    this.position.copy(position)
    this.position.sub(this.sprite.size.clone().divideScalar(2))
  },
  update (game) {
    this.speed = game.keyboard.arrows.size > 1 ? 0.75 : 1

    game.keyboard.arrows.forEach(key => {
      this.move(DIRECTION_MAP[key], this.speed)
    })
  },
  draw (ctx, viewport) {
    if (!viewport.intersectsBox(this.box)) return

    this.corner.copy(this.position).sub(viewport.min)

    ctx.fillStyle = 'white'
    ctx.fillRect(this.corner.x, this.corner.y, this.sprite.size.x, this.sprite.size.y)
  }
}

class Viewport extends Box2 {
  constructor (position, size) {
    super()

    this.setFromCenterAndSize(position, size)
    this.size = size
    this.target = null
  }

  follow (target) {
    assert.ok(target.position && target.position instanceof Vector2, 'target should have a position property')

    this.target = target
  }

  update (game) {
    if (this.target) {
      this.setFromCenterAndSize(this.target.position, this.size)
    }
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
    this.game.viewport.update(this.game)

    this.render()
  },
  render () {
    // bg
    this.game.ctx.fillStyle = 'black'
    this.game.ctx.fillRect(0, 0, this.game.viewport.size.x, this.game.viewport.size.y)

    this.game.currentScene.draw(this.game.ctx, this.game.viewport)
    this.game.hero.draw(this.game.ctx, this.game.viewport)

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
    this.viewport = new Viewport(new Vector2(), new Vector2(800, 600))
    this.keyboard = keyboard
    this.loop = loop

    this.currentScene = null
    this.scenes = {}
  }

  createElement () {
    return html`<canvas class="ba" width="800" height="600"></canvas>`
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

    this.hero.teleport(this.currentScene, this.currentScene.box.getCenter())
    this.viewport.follow(this.hero)

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
