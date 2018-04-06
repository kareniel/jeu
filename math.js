var assert = require('assert')

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

  sub (v) {
    this.x -= v.x
    this.y -= v.y

    return this
  }

  subVectors (a, b) {
    this.x = a.x - b.x
    this.y = a.y - b.y

    return this
  }

  multiply (v) {
    this.x *= v.x
    this.y *= v.y

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

module.exports = {
  Vector2,
  Box2
}
