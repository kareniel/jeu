var Component = require('./Component')
var { mix } = require('../lib/Interface')
var { IDrawable } = require('../interfaces')

class Layer extends mix(Component).with(IDrawable) {

}

module.exports = Layer
