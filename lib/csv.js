var csv = require('csv-parser')

module.exports = function (file, el, cb) {
  if (!el) return callbackOnce(new Error ('el is undefined'))

  var t = document.createElement('table')
  var more = document.createElement('a')
  more.innerText = 'load 10 more'
  more.onclick = function () {
    parser.resume()
  }
  more.href = 'javascript:void(0)'

  var parser = file.createReadStream().pipe(csv())
  var inc = 0
  var incrBy = 10
  parser.on('data', function (data) {
    if (!inc++) {
      var tr = document.createElement('tr')
      Object.keys(data).forEach(function (name) {
        var th = document.createElement('th')
        th.innerText = name
        tr.appendChild(th)
      })
      t.appendChild(tr)
    }
    var tr = document.createElement('tr')
    Object.keys(data).forEach(function (name) {
      var td = document.createElement('td')
      td.innerText = data[name]
      tr.appendChild(td)
    })
    t.appendChild(tr)
    el.appendChild(t)
    if (inc % incrBy === 0) {
      el.appendChild(more)
      parser.pause()
      callbackOnce(null, t)
    }
  })

  parser.on('end', function () {
    if (inc >= incrBy) {
      el.removeChild(more)
    }
    else {
      callbackOnce(null, t)
    }
  })

  function callbackOnce (err, elem) {
    cb(err, elem)
    cb = function () {}
  }

}
