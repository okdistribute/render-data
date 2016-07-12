# render-data

Show a data stream in a browser. This automatically detects the extension, and displays the data intelligently, supporting video, audio, and images (thanks to [render-media](http://npmjs.com/package/render-media)). 

It will attempt to display filetypes intelligently, like .csv and .json.


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
data.render(file, elem, function (err) {
  console.log('done rendering')
})
```

### example

Example in [yo-fs](http://github.com/karissa/yo-fs).
