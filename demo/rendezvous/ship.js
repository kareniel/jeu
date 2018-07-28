var Matter = require('matter-js')
var { Vector2 } = require('three')

function ship () {
  return {
    ACCELERATION: 1,
    DECELERATION: 1,
    MAX_SPEED: 3,
    position: new Vector2(100, 100),
    speed: 0,
    heading: 0,
    a: new Vector2(100, 100),
    b: new Vector2(100, 100),
    c: new Vector2(100, 100),
    __nextPosition: new Vector2(0, 0),
    __nextDirection: new Vector2(),
    move (keyboard) {
      this.__nextDirection.copy(keyboard.getDirection())

      if (this.__nextDirection.x !== 0) ship.rotate(this.__nextDirection.x)
      if (this.__nextDirection.y === -1) ship.accelerate()
      if (this.__nextDirection.y === 1) ship.decelerate()
    },
    rotate (direction) {
      this.heading += (direction * 2.1)
      if (this.heading > 360) this.heading = 0
      if (this.heading < 0) this.heading = 360
    },
    accelerate () {
      if (this.speed < this.MAX_SPEED) this.speed += 0.2
    },
    decelerate () {
      if (this.speed > 0) this.speed -= 0.1
    },
    getX (dist, diff, offsetX = 0) {
      return dist * Math.cos(toRadians(this.heading + diff)) + offsetX
    },
    getY (dist, diff, offsetY = 0) {
      return dist * Math.sin(toRadians(this.heading + diff)) + offsetY
    },
    update (dt) {
      this.a.set(this.getX(10, 0, this.position.x), this.getY(10, 0, this.position.y))
      this.b.set(this.getX(10, 120, this.position.x), this.getY(10, 120, this.position.y))
      this.c.set(this.getX(10, 240, this.position.x), this.getY(10, 240, this.position.y))

      if (this.speed) {
        this.__nextPosition.set(this.getX(this.speed, 0), this.getY(this.speed, 0))
        this.position.add(this.__nextPosition)
        this.speed -= 0.005
        if (this.speed < 0) this.speed = 0
      }
    },
    draw (ctx) {
      ctx.strokeStyle = 'white'

      ctx.beginPath()

      ctx.moveTo(this.a.x, this.a.y)
      ctx.lineTo(this.b.x, this.b.y)
      ctx.lineTo(this.c.x, this.c.y)
      ctx.lineTo(this.a.x, this.a.y)

      ctx.closePath()

      ctx.stroke()
    }
  }
}

function approach (start, end, shift) {
  return start < end
    ? Math.min(start + shift, end)
    : Math.max(start - shift, end)
}

function toRadians (angle) {
  return angle * (Math.PI / 180)
}

module.exports = ship
