"use strict";

var reduce = require("reducers/reduce")

function test(f) {
  return function(assert, done) {
    f(function(actual, expect, comment) {
      var values = []
      reduce(actual, function(expected, actual) {
        values.push(actual)
        if (expected.length === 1) {
          assert.deepEqual(values, expect, comment)
          done()
        }
        return expected.slice(1)
      }, expect)
    })
  }
}

module.exports = test
