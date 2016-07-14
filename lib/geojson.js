var pump = require('pump')
var geoJsonStream = require('geojson-stream')
var leafletStream = require('leaflet-stream')
var map = require('leaflet-default')

module.exports = function (file, el, cb) {
  var elem = document.createElement('div')
  var stream = leafletStream(map(elem))
  pump(file.createReadStream(), geoJsonStream.parse(), stream, function (err) {
    if (err) return cb(err)
    el.appendChild(elem)
    return cb(null, elem)
  })
}
