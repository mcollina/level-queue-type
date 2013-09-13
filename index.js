var sublevel = require('level-sublevel')

function Queue(db, name) {
  if (!(this instanceof Queue)) return new Queue(db, name)

  db = sublevel(db)

  this._db = db.sublevel(name)

  if (!this._db._queuesStreams) {
    this._db._queuesStreams = {}
  }

  this._name = name

  this._shifts = []
}

module.exports = Queue

Queue.prototype.push = function(element, callback) {
  var key = (new Date()).toISOString()

  this._db.put(key, element, callback)

  return this;
}

Queue.prototype.shift = function(callback) {
  this._shifts.push(callback)

  if (!this._db._queuesStreams[this._name]) {
    this._startStream()
  }
}

Queue.prototype._startStream = function() {
  var stream = this._db.createReadStream()

    , db = this._db

    , shifts = this._shifts

    , name = this._name

    , onEnd = function(err) {
                delete db._queuesStreams[name]
                var shift

                while(shift = shifts.shift()) {
                  shift(err)
                }
              }

  stream.on('data', function(data) {
    var callback = shifts.shift()

    db.del(data.key, function(err) {
      callback(err, data.value)
    })

    if (shifts.length === 0) {
      stream.destroy()
      return;
    }
  })

  stream.on('error', onEnd)

  stream.on('end', onEnd)

  db._queuesStreams[name] = stream

  return stream;
}

Queue.prototype.clear = function(callback) {
  this._db.createReadStream()
      .pipe(this._db.createWriteStream({
              type: 'del'
            }))
      .on('close', callback)

  return this;
}

