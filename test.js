var test = require('tap').test
  , level = require('level-test')()
  , queue = require('./')
  , refute = require('referee').refute
  , assert = require('referee').assert

function oneElement(q, callback) {
  q.push('hello world', function(err) {
    refute(err)
    callback()
  })
}

function twoElements(q, callback) {
  oneElement(q, function(err) {
    refute(err)
    q.push('hello matteo', callback)
  })
}

function shift(q, callback) {
  return function(err) {
    refute(err)

    q.shift(function(err, value) {
      refute(err)
      callback(value)
    })
  }
}

function count(db, callback) {
  var stream = db.createReadStream()
    , count = 0

  stream.on('data', function() {
    count++
  })

  stream.on('end', function() {
    callback(count)
  })
}

function verifyCount(db, num, t) {
  return function() {
    count(db, function(count) {
      assert.equals(num, count, 'wrong db size')
      t.end()
    })
  }
}

function clear(q, callback) {
  return function(err) {
    refute(err)

    q.clear(function(err) {
      refute(err)
      callback()
    })
  }
}

test('push and shift', function(t) {
  var db = level()
    , q = queue(db, 'my-awesome-queue')

  oneElement(q, shift(q, function(value) {
    assert.equals('hello world', value, 'pushed and shifted values should equal')
    t.end()
  }))
});

test('push should save to the db', function(t) {
  var db = level()
    , q = queue(db, 'my-awesome-queue')

  twoElements(q, verifyCount(db, 2, t));
});

test('shift should remove from the db', function(t) {
  var db = level()
    , q = queue(db, 'my-awesome-queue')

  twoElements(q, shift(q, verifyCount(db, 1, t)));
});

test('clear should remove all elements from the db', function(t) {
  var db = level()
    , q = queue(db, 'my-awesome-queue')

  twoElements(q, clear(q, verifyCount(db, 0, t)));
});
