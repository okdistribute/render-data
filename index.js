var path = require('path')
var media = require('render-media')
var pump = require('pump')
var streamToBlobURL = require('stream-to-blob-url')
var L = require('leaflet')
var geoJsonStream = require('geojson-stream')
var leafletStream = require('leaflet-geojson-stream')

var appendCSV = require('./lib/append-csv')

var exts = {
  '.csv': 'csv',
  '.tsv': 'csv',
  '.json': 'raw',
  '.tex': 'raw',
  '.geojson': 'geojson'
}

module.exports = { render: render, append: append }

function render (entry, el, cb) {
  if (typeof el === 'string') el = document.querySelector(el)
  el.innerHTML = ''
  append(entry, el, cb)
}

function append (file, el, cb) {
  validateFile(file)
  if (typeof el === 'string') el = document.querySelector(el)
  if (!cb) cb = function () {}

  var filetype = exts[path.extname(file.name).toLowerCase()]
  if (filetype === 'csv') {
    appendCSV(file, el, function (err, elem) {
      if (err) return cb(err)
      return cb(null, elem)
    })
  } else if (filetype === 'geojson') {
    var elem = document.createElement('div')
    elem.style.cssText = 'height:500px;'
    var map = L.map(elem).setView([0, 0], 2)
    var gj = L.geoJson().addTo(map)
    var stream = leafletStream.layerPipe(gj)
    pump(file.createReadStream(), geoJsonStream.parse(), stream, function (err) {
      if (err) return cb(err)
      el.appendChild(elem)
      return cb(null, elem)
    })
  } else if (filetype === 'raw') {
    raw(file, el, cb)
  } else {
    media.append(file, el, function (err, elem) {
      if (err) return cb(err)
      return cb(null, elem)
    })
  }
}

function validateFile (file) {
  if (file == null) {
    throw new Error('file cannot be null or undefined')
  }
  if (typeof file.name !== 'string') {
    throw new Error('missing or invalid file.name property')
  }
}

function raw (file, el, cb) {
  var elem = document.createElement('iframe')
  streamToBlobURL(file.createReadStream(), function (err, url) {
    if (err) return cb(err)
    elem.src = url
    elem.sandbox = 'allow-forms allow-scripts'
    el.appendChild(elem)
    return cb(null, elem)
  })
}
