"use strict";

var reduce = require("reducible/reduce")
var end = require("reducible/end")
var isError = require("reducible/is-error")
var once = require("functional/once")

function throws(f) {
  return function() {
    try { return f.apply(f, arguments) }
    catch (error) { process.nextTick(function() { throw error }) }
  }
}

function passback(source, pack, callback) {
  if (!callback) {
    callback = pack
    pack = null
  }

  // Make sure that callback is called just once
  callback = once(callback)

  reduce(source, throws(function(value, result) {
    // If there is an `error` mark `source` errored and pass 
    if (isError(value)) callback(value)
    // If source is `end`-ed pass back result to a callback.
    else if (value === end) {
      return pack ? callback(null, pack.apply(pack, result)) :
             callback.apply(callback, [null].concat(result))
    } else {
      result.push(value)
    }

    return result
  }), [])
}

module.exports = passback
