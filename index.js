var path = require('path')
var media = require('render-media')
var streamToBlobURL = require('stream-to-blob-url')

var appendCSV = require('./lib/append-csv')

var exts = {
  '.csv': 'csv',
  '.tsv': 'csv',
  '.json': 'raw',
  '.tex': 'raw'
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
