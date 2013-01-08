"use strict";

var callback = require("../callback")
var passback = require("../passback")

var test = require("reducers/test/util/test")

var capture = require("reducers/capture")
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

  assert(entries, fs.readdirSync("./"), "arrays results are streamed")
})

exports["test fs.readdir"] = test(function(assert) {
  var entries = callback(fs.readdir, "./")

  assert(entries, fs.readdirSync("./"), "arrays results are streamed")
})

exports["test error"] = test(function(assert) {
  var entries = callback(fs.readdir, "./does-not-exists")
  // Unfortunately sync operations throw diff errors, so we need to
  // get one in callback.
  fs.readdir("./does-not-exists", function(error) {
    assert(entries, { values: [], error: error }, "errors do propagate")
  })
})

exports["test error handling"] = test(function(assert) {
  var entries = callback(fs.readdir, "./does-not-exists")
  var actual = capture(entries, function onerror(error) {
    return ["default"]
  })

  assert(actual, ["default"], "errors has being handled")
})

exports["test passback"] = function (assert, done) {
  var entries = callback(fs.readdir, "./")

  passback(entries, Array, function (err, values) {
    assert.equal(err, null, "error is null")
    assert.deepEqual(values, fs.readdirSync("./"), "values is correct")
    done()
  })
}

exports["test passback singular"] = function (assert, done) {
  var stat = callback(fs.stat, ".")

  passback(stat, function (err, stat) {
    assert.equal(err, null, "error is null")
    assert.ok(stat.isDirectory(), "stat is a directory")
    done()
  })
}


if (require.main === module)
  require("test").run(exports)
