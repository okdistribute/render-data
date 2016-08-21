var pump = require('pump')
var L = require('leaflet')
var geoJsonStream = require('geojson-stream')
var leafletStream = require('leaflet-stream')

module.exports = function (file, el, opts, cb) {
  if ((typeof opts) === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  var elem = document.createElement('div')
  elem.setAttribute('style','width:100%;height:500px;')
  el.appendChild(elem)

  var stream = leafletStream(leafletMap(elem, opts))
  pump(file.createReadStream(), geoJsonStream.parse(), stream, function (err) {
    if (err) return cb(err)
    return cb(null, elem)
  })
}

function leafletMap (mapEl, opts) {
  if (!opts) opts = {}
  opts.defaultStyle = opts.defaultStyle || true,
  opts.center = opts.center || [0, 0]
  opts.zoom = opts.zoom || 3

  if (opts.defaultStyle) {
    L.Icon.Default.imagePath = '//cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images'
    ensureStyle()
  }
  map = L.map(mapEl, opts)
  map.setView(opts.center, opts.zoom)

  if (opts.tiles !== false) {
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
