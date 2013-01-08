var reduce = require("reducible/reduce")
var end = require("reducible/end")
var isError = require("reducible/is-error")

module.exports = toArray

function toArray(source, packer, callback) {
    var ended = false

    if (arguments.length === 2) {
        callback = packer
        packer = null
    }

    reduce(source, function(value, result) {
        if (ended) {
            return result
        }

        // If source is `end`-ed deliver accumulated `state`.
        if (value === end) {
            ended = true

            var args = [null]

            if (packer) {
                args.push(packer.apply(null, result))
            } else {
                args = args.concat(result)
            }

            return safe(callback, args)
        }
        // If is source has an error, deliver that.
        else if (isError(value)) {
            ended = true

            return safe(callback, [value])
        }

        result.push(value)

        return result
    }, [])
}

function safe(callback, args) {
    try {
        return callback.apply(null, args)
    } catch (err) {
        process.nextTick(function () {
            throw err
        })
    }
}
