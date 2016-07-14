var streamToBlobURL = require('stream-to-blob-url')

module.exports = function (file, el, cb) {
  var elem = document.createElement('iframe')
  streamToBlobURL(file.createReadStream(), function (err, url) {
    if (err) return cb(err)
    elem.src = url
    elem.sandbox = 'allow-forms allow-scripts'
    el.appendChild(elem)
    return cb(null, elem)
  })
}
