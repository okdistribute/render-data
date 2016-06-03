# render-data

Show a data stream in a browser. This automatically detects the extension, and displays the data intelligently, supporting video, audio, and images (thanks to [render-media](http://npmjs.com/package/render-media)). It will attempt to display unrecognized file types as text.

This module is used by [explore-dat](http://github.com/karissa/explore-dat).

### install

```
npm install render-data
```

### usage

```js
var render = require('render-data')
var data = fs.readFileSync('/path/to/my/data/and/stuff')
var file = {
  name: 'stuff.R',
  length: data.length,
  createReadStream: fs.createReadStream('/path/to/my/data/and/stuff')
}
```

### todo

- [ ] make length not required by allowing user to pass only createReadStream and file name.
