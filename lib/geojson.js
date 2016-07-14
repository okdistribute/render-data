var pump = require('pump')
var L = require('leaflet')
var through = require('through2')
var coordEach = require('@turf/meta').coordEach
var geoJsonStream = require('geojson-stream')
var leafletStream = require('leaflet-stream')

module.exports = function (file, el, cb) {
  var elem = document.createElement('div')
  elem.setAttribute('style', 'width:100%;height:500px;')
  el.appendChild(elem)
  var map = leafletMap(elem)
  var stream = leafletStream(map)

  var xSum = 0
  var ySum = 0
  var len = 0
  var centroid = through.obj(function (data, enc, next) {
    coordEach(data, function (coord) {
      xSum += coord[0]
      ySum += coord[1]
      len++
    }, true)
    next(null, data)
  })

  pump(file.createReadStream(), geoJsonStream.parse(), centroid, stream, function (err) {
    if (err) return cb(err)
    var coords = [xSum / len, ySum / len]
    map.setView(coords)
    console.log(coords)
    return cb(null, elem)
  })
}

function leafletMap (mapEl, opt) {
  opt = opt || {
    defaultStyle: true
  }
  if (opt.defaultStyle) {
    L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images'
    ensureStyle()
  }

  var map = L.map(mapEl)
  map.setView([0, 0], 3)

  if (opt.tiles !== false) {
    // add an OpenStreetMap tile layer
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }

  return map
}

function ensureStyle () {
  document.documentElement.style.height = '100%'
  document.body.style.height = '100%'
  document.body.style.margin = '0'

  var mapStyle = document.createElement('link')
  mapStyle.setAttribute('rel', 'stylesheet')
  mapStyle.setAttribute('href', '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/leaflet.css')
  document.body.appendChild(mapStyle)
}
