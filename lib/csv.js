var csv = require('csv-parser')

module.exports = function (file, el, cb) {
  if (!el) return callbackOnce(new Error('el is undefined'))

  var t = document.createElement('table')
  var more = document.createElement('a')
  more.innerText = 'load 10 more'
  more.onclick = function () {
    parser.resume()
  }
  more.href = 'javascript:void(0)'

  var stream = file.createReadStream()
  var parser = stream.pipe(csv())
  var inc = 0
  var incrBy = 10
  el.appendChild(t)
  parser.on('data', function (data) {
    var tr
    if (!inc++) {
      tr = document.createElement('tr')
      Object.keys(data).forEach(function (name) {
        var th = document.createElement('th')
        th.innerText = name
        tr.appendChild(th)
      })
      t.appendChild(tr)
    }
    tr = document.createElement('tr')
    Object.keys(data).forEach(function (name) {
      var td = document.createElement('td')
      td.innerText = data[name]
      tr.appendChild(td)
    })
    t.appendChild(tr)
    if (inc % incrBy === 0) {
      el.appendChild(more)
      parser.pause()
      callbackOnce(null, t)
    }
  })

  parser.on('error', function (err) {
    callbackOnce(err)
  })

  parser.on('end', function () {
    if (inc >= incrBy) el.removeChild(more)
    else callbackOnce(null, t)
  })

  function callbackOnce (err, elem) {
    cb(err, elem)
    cb = function () {}
  }
  return el
}
