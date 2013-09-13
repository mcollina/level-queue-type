var sublevel = require('level-sublevel')

function Queue(db, name) {
  if (!(this instanceof Queue)) return new Queue(db, name)

  this._db = sublevel(db).sublevel(name)
}

module.exports = Queue

Queue.prototype.push = function(element, callback) {
  var key = (new Date()).toISOString()

  console.log('push', key)

  this._db.put(key, element, callback)

  return this;
}

Queue.prototype.shift = function(callback) {
  var stream = this._db.createReadStream({
                 limit: 1
               })

    , db = this._db

  stream.once('data', function(data) {
    console.log('shift', data.key)
    db.del(data.key, function(err) {
      callback(err, data.value)
    })
  })

  stream.once('error', callback)

  return this;
}

Queue.prototype.clear = function(callback) {
  this._db.createReadStream()
      .pipe(this._db.createWriteStream({
              type: 'del'
            }))
      .on('close', callback)

  return this;
}
