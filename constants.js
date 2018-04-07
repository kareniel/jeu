var { Vector2 } = require('./classes/math')

const ARROW_KEYS = ['UP', 'DOWN', 'LEFT', 'RIGHT']

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

module.exports = {
  ARROW_KEYS,
  DIRECTION_MAP,
  KEY_MAP
}
