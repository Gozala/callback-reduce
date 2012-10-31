"use strict";

var test = require("reducers/test/util/test")
var callback = require("../callback")
var reduce = require("reducers/reduce")
var map = require("reducers/map")
var fs = require("fs")

exports["test map fs.stat"] = test(function(assert) {
  var async = false
  var stat = callback(fs.stat, ".")
  var actual = map(stat, function(value) {
    return { directory: value.isDirectory(), async: async }
  })

  assert(actual, [{ directory: true, async: true }],
                  "callback is a normal stream")
  async = true
})

exports["test fs.statSync"] = test(function(assert) {
  var async = false
  var stat = fs.statSync(".")
  var actual = map(stat, function(value) {
    return { directory: value.isDirectory(), async: async }
  })

  assert(actual, [{ directory: true, async: false }],
                  "callback is a normal stream")
  async = true
})

exports["test fs.readdir"] = test(function(assert) {
  var entries = callback(fs.readdir, "./")

  assert(entries, fs.readdirSync("./"), "arrys results are streamed")
})

if (require.main === module)
  require("test").run(exports)
