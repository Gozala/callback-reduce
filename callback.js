"use strict";

var reducible = require("reducible/reducible")
var reduce = require("reducible/reduce")
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
  return reducible(function(next, initial) {
    f.apply(self, params.concat(function(error, data) {
      if (error) next(error, initial)
      else if (arguments.length === 2) reduce(data, next, initial)
      else reduce(slicer.call(arguments, 1), next, initial)
    }))
  })
}

module.exports = callback
