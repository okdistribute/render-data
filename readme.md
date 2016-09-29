# render-data

Show a data stream in a browser. This automatically detects the extension, and displays the data intelligently, supporting video, audio, and images (thanks to [render-media](http://npmjs.com/package/render-media)).

It will attempt to display filetypes intelligently, like .csv, .json, and .geojson!

### Server-side rendering

Can also be used in server-side applications to statically render directory trees via javascript. However, geojson will not render in server-side due to a dependence on `window` from Leaflet.


### install

```
npm install render-data
```

### usage

```js
var data = require('render-data')
var file = {
  name: 'stuff.R',
  createReadStream: function () {
    return fs.createReadStream('/path/to/my/data/and/stuff')
  }
}
data.render(file, elem, opts, function (err) {
  console.log('done rendering')
})
```

### example

Example in [yo-fs](http://github.com/karissa/yo-fs).
