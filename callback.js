"use strict";

var convert = require("reducers/convert")
var accumulate = require("reducers/accumulate")
var error = require("reducers/error")
var end = require("reducers/end")
var slicer = Array.prototype.slice


var callback = function callback(f/*, ...params*/) {
  /**
  Function takes `f` function and arguments to be passed to it &
  returns lazy sequence representing arguments that would be
  passed to a callback function if `f` was invoked with given arguments
  + that callback. Note that sequence can be read multiple times causing
  `f` to be executed each time. `this` in the context of `f` will be same
  as in the execution context of this function, so feel free to pass one
  via `.call` or `.apply`.
  **/
  var params = slicer.call(arguments, 1)
  var self = this || f
  return convert(void(0), function(_, next, initial) {
    f.apply(self, params.concat(function(e, data) {
      if (e) next(end(), next(error(e), initial))
      else if (arguments.length === 2) accumulate(data, next, initial)
      else accumulate(slicer.call(arguments, 1), next, initial)
    }))
  })
}

module.exports = callback
