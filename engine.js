var html = require('choo/html')
var Nanocomponent = require('choo/component')
var nanobus = require('nanobus')

var { Vector2, Box2 } = require('./math')

const DIRECTION_MAP = {
  UP: new Vector2(0, -1),
  DOWN: new Vector2(0, 1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0)
}

const KEY_MAP = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT'
}

class Scene {
  constructor () {
    var position = new Vector2(0, 0)
    var size = new Vector2(800, 600)

    this.box = Box2.from(position, size)
  }
}

class Viewport {
  constructor (target) {
    var position = target.getCenter()
    var size = new Vector2(800, 600)

    this.box = Box2.from(position, size)
    this.target = target
  }

  update () {
    this.box.setFromCenterAndSize(this.box.getSize(), this.target.getCenter())
  }
}

var hero = {
  sprite: {
    size: new Vector2(24, 48)
  },
  box: Box2.from(new Vector2(), this.sprite.size),
  speed: 1,
  scene: null,
  move (vector, speed = 1) {
    this.box.translate(vector.multiplyScalar(speed))
  },

  update (game) {
    this.speed = game.keyboard.arrows.size > 1 ? 0.7 : 1

    game.keyboard.arrows.forEach(key => this.move(DIRECTION_MAP[key], this.speed))
  },

  draw (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.box.min.x, this.box.min.y, this.sprite.size.x, this.sprite.size.y)
  }
}

var keyboard = {
  direction: new Set()
}

var loop = {
  start (game) {
    this.game = game
    this.render = this.render.bind(this)
    this.update = this.update.bind(this)

    this.update()
  },
  update () {
    this.game.components.updatable.forEach(component => component.update(this.game))

    this.render()
  },
  render () {
    this.game.components.drawable.forEach(component => component.draw(this.game.ctx))

    window.requestAnimationFrame(this.update)
  }
}

class Game extends Nanocomponent {
  constructor () {
    super()

    this.emitter = nanobus()
    this.hero = hero
    this.viewport = new Viewport(hero.box)
    this.keyboard = keyboard
    this.loop = loop
    this.scenes = {}
    this.components = {
      all: [],
      drawable: [],
      updatable: []
    }

    this.on = this.emitter.on.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
  }

  register (component) {
    if (component.draw) this.components.drawable.push(component)
    if (component.update) this.components.updatable.push(component)

    this.components.all.push(component)
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
    data.scenes.forEach(scene => {
      scene.components.forEach(component => this.register(component))
    })

    this.register(this.hero)

    document.addEventListener('keydown', e => {
      this.keyboard.arrows.add(KEY_MAP[e.key])
    })

    document.addEventListener('keyup', e => {
      this.keyboard.arrows.delete(KEY_MAP[e.key])
    })

    this.loop.start(this)
  }
}

module.exports = {
  Game,
  Scene
}
