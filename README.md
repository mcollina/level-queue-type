# level-queue-type

The queue datatype inside leveldb, it supports concurrent shift and
pushes!

[![build
status](https://secure.travis-ci.org/mcollina/level-queue-type.png)](http://travis-ci.org/mcollina/level-queue-type)

## Example

```js
var queue = require('level-queue-type')
var level = require('level')

var db = level(__dirname + '/db')

var jobs = queue(db)

// add last
people.push({ job: 'do something' }, fn)

// remove first
people.shift(function(err, value) {
  // value will be { job: 'do something' }
})

```

You can also use [level-sublevel](http://npm.im/level-sublevel) to have named
queues in your Level database.

## Installation

With [npm](https://npmjs.org) do:

```bash
npm install level-queue-type
```

## License

(MIT)

Copyright (c) 2013 Matteo Collina &lt;hello@matteocollina.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a
copy of
this software and associated documentation files (the "Software"), to
deal in
the Software without restriction, including without limitation the
rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies
of the Software, and to permit persons to whom the Software is furnished
to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE
SOFTWARE.
