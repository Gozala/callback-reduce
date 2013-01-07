var take = require("reducers/take")
var toArray = require("./toArray")

module.exports = value

function value(source, callback) {
    toArray(take(source, 1), function (err, array) {
        callback(err, array && array[0])
    })
}
