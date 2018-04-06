var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var Nanocomponent = require('choo/component')
var assert = require('assert')

css('tachyons')

var app = choo()

app.use(store)
app.route('/', view)
app.mount('body')

class Vector2 {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  add (v) {
    this.x += v.x
    this.y += v.y

    return this
  }

  addVectors (a, b) {
    this.x = a.x + b.x
    this.y = b.y + b.y

    return this
  }

  subVectors (a, b) {
    this.x = a.x - b.x
    this.y = a.y - b.y

    return this
  }

  multiplyScalar (scalar) {
    this.x *= scalar
    this.y *= scalar

    return this
  }

  clone () {
    return new Vector2(this.x, this.y)
  }
}

class Box2 {
  constructor (min, max) {
    if (min) assert(min instanceof Vector2, 'min should be type Vector2')
    if (max) assert(max instanceof Vector2, 'max should be type Vector2')

    this.min = min ? min.clone() : new Vector2(-Infinity, -Infinity)
    this.max = max ? max.clone() : new Vector2(+Infinity, +Infinity)
  }

  static from (center, size) {
    var box = new Box2()

    return box.setFromCenterAndSize(center, size)
  }

  translate (offset) {
    this.min.add(offset)
    this.max.add(offset)

    return this
  }

  getCenter () {
    var center = new Vector2()

    return center
      .addVectors(this.min, this.max)
      .multiplyScalar(0.5)
  }

  getSize () {
    var size = new Vector2()

    return size.subVectors(this.max, this.min)
  }

  setFromCenterAndSize (center, size) {
    assert(center instanceof Vector2, 'center should be type Vector2')
    assert(size instanceof Vector2, 'size should be type Vector2')

    var halfX = size.x / 2
    var halfY = size.y / 2

    this.min = new Vector2(center.x - halfX, center.y - halfY)
    this.max = new Vector2(center.x + halfX, center.y + halfY)

    return this
  }

  clone () {
    return new Box2(this.min, this.max)
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

class Scene {
  constructor () {
    var position = new Vector2(0, 0)
    var size = new Vector2(800, 600)

    this.box = Box2.from(position, size)
  }
}

class Movement {
  constructor (speed = 1) {
    this.up = new Vector2(0, -speed)
    this.down = new Vector2(0, speed)
    this.left = new Vector2(-speed, 0)
    this.right = new Vector2(speed, 0)
  }
}

class Hero {
  constructor () {
    this.sprite = { size: new Vector2(24, 48) }
    this.box = Box2.from(new Vector2(), this.sprite.size)
    this.location = 'demo'
    this.move = new Movement()
  }

  update (game) {
    if (game.pressedKeys.has('w')) this.box.translate(this.move.up)
    if (game.pressedKeys.has('s')) this.box.translate(this.move.down)
    if (game.pressedKeys.has('a')) this.box.translate(this.move.left)
    if (game.pressedKeys.has('d')) this.box.translate(this.move.right)
  }

  draw (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.box.min.x, this.box.min.y, this.sprite.size.x, this.sprite.size.y)
  }
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

    this.components = {
      all: [],
      drawable: [],
      updatable: []
    }

    this.scenes = { }

    this.pressedKeys = new Set()
    this.loop = loop
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

    this.start()
  }

  start () {
    var rect = this.el.getBoundingClientRect()
    var bg = {
      width: rect.width,
      height: rect.height,
      draw (ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, this.width, this.height)
      }
    }

    var hero = new Hero()
    this.scenes['demo'] = new Scene()
    this.viewport = new Viewport(hero.box)

    var components = [bg, hero]

    components.forEach(component => this.register(component))

    document.addEventListener('keydown', e => {
      this.pressedKeys.add(e.key)
    })

    document.addEventListener('keyup', e => {
      this.pressedKeys.delete(e.key)
    })

    this.loop.start(this)
  }
}

var game = new Game()

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {

  })
}

function view (state, emit) {
  return html`
    <body class="overflow-hidden">
      ${game.render()}
    </body>`
}
