var mixwith = require('mixwith')

class Interface {
  static create (obj) {
    return mixwith.Mixin(superclass => {
      var I = class extends superclass {}

      for (var key in obj) {
        I.prototype[key] = obj[key]
      }

      return I
    })
  }

  static mix (...args) {
    return mixwith.mix(...args)
  }
}

module.exports = Interface
