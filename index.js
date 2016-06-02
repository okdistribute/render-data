var path = require('path')
var media = require('render-media')
var streamToBlobURL = require('stream-to-blob-url')
var csv = require('csv-parser')

module.exports = { render: render, append: append }

function render (entry, el, cb) {
  if (typeof el === 'string') el = document.querySelector(el)
  el.innerHTML = ''
  append(entry, el, cb)
}

function append (file, el, cb) {
  if (typeof el === 'string') el = document.querySelector(el)
  if (!cb) cb = function () {}

  var extname = path.extname(file.name).toLowerCase()
  if (extname === '.csv') {
    var t = document.createElement('table')
    var parser = file.createReadStream().pipe(csv())
    parser.on('data', function (data) {
      // if (!inc++) {
      //   var tr = document.createElement('tr')
      //   Object.keys(data).forEach(function (name) {
      //     var th = document.createElement('th')
      //     th.innerText = name
      //     tr.appendChild(th)
      //   })
      //   t.appendChild(tr)
      // }
      var tr = document.createElement('tr')
      Object.keys(data).forEach(function (name) {
        var td = document.createElement('td')
        td.innerText = data[name]
        tr.appendChild(td)
      })
      t.appendChild(tr)
      el.appendChild(t)
      // if (inc % 5 === 0) {
      //   if (inc !== 5) $display.contentDocument.body.removeChild(more)
      //   $display.contentDocument.body.appendChild(more)
      //   parser.pause()
      // }
    })



  }
  else {
    media.append(file, el, function (err, elem) {
      if (err) {
        debugger;
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
}

