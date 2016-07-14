var path = require('path')
var media = require('render-media')

var raw = require('./lib/raw')
var csv = require('./lib/csv')
var geojson = require('./lib/geojson')

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
  if (filetype === 'csv') return csv(file, el, cb)
  if (filetype === 'geojson') return geojson(file, el, cb)
  if (filetype === 'raw') return raw(file, el, cb)
  media.append(file, el, cb)
}

function validateFile (file) {
  if (file == null) {
    throw new Error('file cannot be null or undefined')
  }
  if (typeof file.name !== 'string') {
    throw new Error('missing or invalid file.name property')
  }
}
