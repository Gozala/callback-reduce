# callback-reduce

[![Build Status](https://secure.travis-ci.org/Gozala/callback-reduce.png)](http://travis-ci.org/Gozala/callback-reduce)

Reducers is a great abstraction for working with collections of values
eventual or not. In fact it's great because API for working with data is
same map/reduce regardless of weather it's sync or async.


```js
var fold = require("reducers/fold")
var filter = require("reducers/filter")
var map = require("reducers/map")

// Sync
fold(filter(map(array, JSON.parse), isCached), accumulate)

// Async
fold(filter(map(stream, JSON.parse), isCached), accumulate)
```

Another cool concept about reducers is that allows you to work with non sequnce
values with the same API. It just treats atomic vaules as sequences of themself.

```js
var fold = require("reducers/fold")
function sum(sequence) {
  return fold(sequence, function(item, result) {
    return result + item
  }, 0)
}

fold(sum(15), console.log.bind(0, "=>"))            // => 15 undefined
fold(sum([ 15, 3, 7 ]), console.log.bind(0, "=>"))  // => 25 undefined
```

But there are bunch of async APIs around that are designed in terms of:
do action provide a callback, where you'll handle either error or value.

```js
var fs = require("fs")

function getPackageName(path, callback) {
  fs.readFile(path, function(error, buffer) {
    if (error) return callback(error)
    var json = JSON.parse(buffer.toString())
    callback(error, json.name)
  })
}

getPackageName("./package.json", console.log) // => null "callback-reduce"
```

Which is ok but not very composable and there is no simple to transform data.
But with reducers we like the fact of unified API that works on the data
structures regardless of their nature or timing. This libarray lets you get
reducible callbacks for callback styled functions!

```js
var fs = require("fs")
var map = require("reducers/map")
var callback = require("callback-reduce")
var fold = require("reducers/fold")

var content = callback(fs.readFile, "./package.json")
var json = map(map(content, String), JSON.parse)
var name = map(json, function($) { return $.name })

fold(name, console.log.bind(0, "=>"))     // => "callback-reduce" undefined
```

And of course it's lazy and compasable with rest of the API that reducers
provide. For more complicated example see:

```js
var print = require("reducers/debug/print")

var fs = require("fs")
var path = require("path")

var callback = require("callback-reduce")
var expand = require("reducers/expand")
var map = require("reducers/map")
var filter = require("reducers/filter")
var concat = require("reducers/concat")
var cache = require("cache-reduce/cache")


function lstree(root) {
  // Get sequence of directory entries, also we cache it as we read
  // from it several times.
  var entries = cache(callback(fs.readdir, root))
  // Resolve entries to the current path.
  var paths = map(entries, path.join.bind(path, root))
  // Expand sequence of paths, to associated stats. Unfortunately node does not
  // keeps path info in the stats so we need to hack this up. Otherwise it would
  // have being just: var stats = expand(paths, callback.bind(fs, fs.stats))
  var stats = expand(paths, function(path) {
    return map(callback(fs.stat, path), function(stats) {
      stats.toString = path.toString.bind(path)
      return stats
    })
  })
  // Filter & map file paths.
  var files = map(filter(stats, function($) { return $.isFile() }), String)
  // Filter & map directory paths.
  var dirs = map(filter(stats, function($) { return $.isDirectory() }), String)

  // Return concatination given path, file paths, and all the nested paths.
  return concat(root, files, expand(dirs, lstree))
}

print(lstree("./"))
```

## passback

Converts a reducible into a callback

```js
var passback = require("callback-reduce/passback")
var fs = require("fs")
var callback = require("callback-reduce")

var reducible = callback(fs.stat, ".")

passback(reducible, function (err, stat) {
  /* do stuff */
})
```

Also takes an optional packing function, to pack the arguments.

If you were to pass `Array` it would pack the entire content
  of the reducible into an array.

```js
var passback = require("callback-reduce/passback")
var fs = require("fs")
var callback = require("callback-reduce")

var reducible = callback(fs.readdir, "./")

passback(reducible, Array, function (err, files) {
  /* do stuff */
})
```

## Install

    npm install callback-reduce


[reducers]:https://github.com/Gozala/reducers
