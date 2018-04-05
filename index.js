var choo = require('choo')
var html = require('choo/html')
var css = require('sheetify')
var Component = require('choo/component')

const W = 800
const H = 600

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
}

class Hero {
  constructor () {
    this.sprite = {
      width: 24,
      height: 48
    }

    this.position = new Vector2(W / 2 - this.sprite.width / 2, H / 2 - this.sprite.height / 2)
  }

  update (game) {
    if (game.pressedKeys.has('w')) this.position.y--
    if (game.pressedKeys.has('s')) this.position.y++
    if (game.pressedKeys.has('a')) this.position.x--
    if (game.pressedKeys.has('d')) this.position.x++
  }

  draw (ctx) {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.position.x, this.position.y, 24, 48)
  }
}

class Game extends Component {
  constructor () {
    super()

    var game = this

    this.components = {
      all: [],
      renderable: [],
      updatable: []
    }

    this.pressedKeys = new Set()

    this.loop = {
      start () {
        this.render = this.render.bind(this)
        this.update = this.update.bind(this)
        this.update()
      },
      update () {
        game.components.updatable.forEach(component => component.update(game))

        this.render()
      },
      render () {
        game.components.renderable.forEach(component => component.draw(game.ctx))
        window.requestAnimationFrame(this.update)
      }
    }
  }

  register (component) {
    if (component.draw) this.components.renderable.push(component)
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

    var components = [bg, new Hero()]

    components.forEach(component => this.register(component))

    document.addEventListener('keydown', e => {
      this.pressedKeys.add(e.key)
    })

    document.addEventListener('keyup', e => {
      this.pressedKeys.delete(e.key)
    })

    this.loop.start()
  }
}

var game = new Game()

function store (state, emitter) {
  emitter.on('DOMContentLoaded', function () {

  })
}

function view (state, emit) {
  return html`
    <body>
      ${game.render()}
    </body>`
}
