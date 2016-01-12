var path = require('path')
var media = require('render-media')
var streamToBlobURL = require('stream-to-blob-url')

module.exports = { render: render, append: append }

function render (entry, el, cb) {
  if (typeof el === 'string') el = document.querySelector(el)
  el.innerHTML = ''
  append(entry, el, cb)
}

function append (file, el, cb) {
  if (typeof el === 'string') el = document.querySelector(el)
  if (!cb) cb = function () {}

  media.append(file, el, function (err, elem) {
    if (err) {
      elem = document.createElement('iframe')
      streamToBlobURL(file.createReadStream(), file.length, 'text/plain', function (err, url) {
        if (err) return cb(err)
        elem.src = url
        elem.sandbox = 'allow-forms allow-scripts'
        el.appendChild(elem)
        return cb(null, elem)
      })
    }
    return cb(null, elem)
  })
}

