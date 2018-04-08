var assert = require('assert')

class Vector2 {
  constructor (x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  copy (v) {
    assert(v instanceof Vector2, 'copy: v should be type Vector2')

    this.x = v.x
    this.y = v.y

    return this
  }

  add (v) {
    assert(v instanceof Vector2, 'add: v should be type Vector2')

    this.x += v.x
    this.y += v.y

    return this
  }

  addVectors (a, b) {
    assert(a instanceof Vector2, 'addVectors: a should be type Vector2')
    assert(b instanceof Vector2, 'addVectors: b should be type Vector2')

    this.x = a.x + b.x
    this.y = a.y + b.y

    return this
  }

  sub (v) {
    assert(v instanceof Vector2, 'sub: v should be type Vector2')

    this.x -= v.x
    this.y -= v.y

    return this
  }

  subVectors (a, b) {
    assert(a instanceof Vector2, 'subVectors: a should be type Vector2')
    assert(b instanceof Vector2, 'subVectors: b should be type Vector2')

    this.x = a.x - b.x
    this.y = a.y - b.y

    return this
  }

  multiply (v) {
    assert(v instanceof Vector2, 'multiply: v should be type Vector2')

    this.x *= v.x
    this.y *= v.y

    return this
  }

  multiplyScalar (scalar) {
    this.x *= scalar
    this.y *= scalar

    return this
  }

  divide (v) {
    assert(v instanceof Vector2, 'divide: v should be type Vector2')

    this.x /= v.x
    this.y /= v.y

    return this
  }

  divideScalar (scalar) {
    this.x /= scalar
    this.y /= scalar

    return this
  }

  min (v) {
    assert(v instanceof Vector2, 'min: v should be type Vector2')

    this.x = Math.min(this.x, v.x)
    this.y = Math.min(this.y, v.y)

    return this
  }

  max (v) {
    assert(v instanceof Vector2, 'max: v should be type Vector2')

    this.x = Math.max(this.x, v.x)
    this.y = Math.max(this.y, v.y)

    return this
  }

  clone () {
    return new Vector2(this.x, this.y)
  }
}

class Box2 {
  constructor (min, max) {
    if (min) assert(min instanceof Vector2, 'Box2: min should be type Vector2')
    if (max) assert(max instanceof Vector2, 'Box2: max should be type Vector2')

    this.min = min ? min.clone() : new Vector2(-Infinity, -Infinity)
    this.max = max ? max.clone() : new Vector2(+Infinity, +Infinity)
  }

  get width () {
    return this.getSize().x
  }

  get height () {
    return this.getSize().y
  }

  static from (center, size) {
    assert(center instanceof Vector2, 'from: center should be type Vector2')
    assert(size instanceof Vector2, 'from: size should be type Vector2')

    var box = new Box2()

    return box.setFromCenterAndSize(center, size)
  }

  translate (offset) {
    assert(offset instanceof Vector2, 'translate: offset should be type Vector2')

    this.min.add(offset)
    this.max.add(offset)

    return this
  }

  getCenter () {
    var center = new Vector2().addVectors(this.min, this.max).multiplyScalar(0.5)

    return center
  }

  getSize () {
    var size = new Vector2().subVectors(this.max, this.min)

    return size
  }

  setFromCenterAndSize (center, size) {
    assert(center instanceof Vector2, 'setFromCenterAndSize: center should be type Vector2')
    assert(size instanceof Vector2, 'setFromCenterAndSize: size should be type Vector2')

    var halfX = size.x / 2
    var halfY = size.y / 2

    this.min = new Vector2(center.x - halfX, center.y - halfY)
    this.max = new Vector2(center.x + halfX, center.y + halfY)

    return this
  }

  clone () {
    return new Box2(this.min, this.max)
  }

  intersectsBox (box) {
    assert(box instanceof Box2, 'intersectsBox: box should be type Box2')

    // using 4 splitting planes to rule out intersections

    return !(
      box.max.x < this.min.x ||
      box.min.x > this.max.x ||
      box.max.y < this.min.y ||
      box.min.y > this.max.y
    )
  }

  containsBox (box) {
    return (
      this.min.x <= box.min.x &&
      box.max.x <= this.max.x &&
      this.min.y <= box.min.y &&
      box.max.y <= this.max.y
    )
  }

  union (box) {
    assert(box instanceof Box2, 'assert: box should be type Box2')

    this.min.min(box.min)
    this.max.max(box.max)

    return this
  }
}

module.exports = {
  Vector2,
  Box2
}
