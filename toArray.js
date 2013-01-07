var reduce = require("reducible/reduce")
var end = require("reducible/end")
var isError = require("reducible/is-error")

module.exports = toArray

function toArray(source, callback) {
    var ended = false

    reduce(source, function(value, result) {
        if (ended) {
            return result
        }

        // If source is `end`-ed deliver accumulated `state`.
        if (value === end) {
            ended = true

            return safe(callback, null, result)
        }
        // If is source has an error, deliver that.
        else if (isError(value)) {
            ended = true

            return safe(callback, value)
        }

        result.push(value)

        return result
    }, [])
}

function safe(callback, arg1, arg2) {
    try {
        return callback(arg1, arg2)
    } catch (err) {
        process.nextTick(function () {
            throw err
        })
    }
}
