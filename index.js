
function Queue(db) {
  if (!(this instanceof Queue)) return new Queue(db)

  this._db = db
}

module.exports = Queue

Queue.prototype.push = function(element, callback) {
  var key = (new Date()).toISOString()
    , stream = this._db._queuesStream

  this._db.put(key, element, { valueEncoding: 'json' }, callback)

  if (stream) {
    stream.restartIfNoValue = true
  }

  return this
}

Queue.prototype.shift = function(callback) {
  if (!this._db._queueStream) {
    this._startStream([])
  }
  this._db._queueStream.shifts.push(callback)
}

Queue.prototype._startStream = function(shifts) {
  var stream = this._db.createReadStream({ valueEncoding: 'json' })

    , db = this._db

    , that = this

    , onEnd = function(err) {
                delete db._queueStream
                var shift
                
                if (!this.restartIfNoValue) {
                  while(shift = shifts.shift()) {
                    shift(err)
                  }
                } else {
                  that._startStream(shifts)
                }
              }

  stream.on('data', function(data) {
    var callback = shifts.shift()

    db.del(data.key, function(err) {
      callback(err, data.value)
    })

    if (shifts.length === 0) {
      stream.destroy()
      return
    }
  })

  stream.on('error', onEnd)

  stream.on('end', onEnd)

  stream.shifts = shifts
  db._queueStream = stream

  return stream
}

Queue.prototype.clear = function(callback) {
  this._db.createReadStream()
      .pipe(this._db.createWriteStream({
              type: 'del'
            }))
      .on('close', callback)

  return this
}

