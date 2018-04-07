class Timer {
  start () {
    this.startTime = new Date()
    this._t = new Date()
    this._lastElapsed = 0
  }

  elapsed () {
    this._t = new Date()
    this._lastElapsed = this._t - this.startTime

    return this._lastElapsed
  }
}

module.exports = Timer
