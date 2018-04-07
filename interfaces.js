var Interface = require('./lib/Interface')

var IDrawable = Interface.create({
  draw () {
    throw new Error('draw should be implemented')
  }
})

var IUpdatable = Interface.create({
  update () {
    throw new Error('draw should be implemented')
  }
})

module.exports = {
  IDrawable,
  IUpdatable
}
