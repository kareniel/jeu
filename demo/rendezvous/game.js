var jeu = require('../../src')
var Matter = require('matter-js')

var ship = require('./ship.js')

var demo = jeu({
  init () {
    var cruiser = ship()

    this.engine = Matter.Engine.create()
    this.entities = [
      cruiser
    ]

    var bodies = this.entities.map(e => e.body).filter(e => e.body)

    Matter.World.add(this.engine.world, [ bodies ])
  },

  load (done) {
    done()
  },

  update (dt) {
    Matter.Engine.update(this.engine, 1000 / 60)

    this.entities.map(entity => {
      entity.move(this.keyboard)
      entity.update(dt)
    })
  },

  draw () {
    this.clear()

    this.entities.map(entity => {
      if (entity.draw) {
        entity.draw(this.ctx)
      }

      if (entity.body) {
        this.ctx.beginPath()

        var vertices = entity.body.vertices

        this.ctx.moveTo(vertices[0].x, vertices[0].y)

        for (var j = 1; j < vertices.length; j += 1) {
          this.ctx.lineTo(vertices[j].x, vertices[j].y)
        }

        this.ctx.lineTo(vertices[0].x, vertices[0].y)

        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = '#999'
        this.ctx.stroke()
      }
    })

    this.debugger.draw(this.ctx, this)
  }
})

module.exports = demo
