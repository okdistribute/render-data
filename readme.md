# render-data

Show a data stream in a browser. This automatically detects the extension, and displays the data intelligently, supporting video, audio, and images (thanks to [render-media](http://npmjs.com/package/render-media)). It will also attempt to display complicated filetypes intelligently, like .csv or shapefiles (coming soon).


### install

```
npm install render-data
```

### usage

```js
var data = require('render-data')
var file = {
  name: 'stuff.R',
  createReadStream: fs.createReadStream('/path/to/my/data/and/stuff')
}
data.render(file, elem, function (err) {
  console.log('done rendering')
})
```

### example

Example in [yo-fs](http://github.com/karissa/yo-fs).
