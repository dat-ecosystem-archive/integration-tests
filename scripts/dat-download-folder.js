var Dat = require('dat-node')
var tempy = require('tempy')
var mn = require('mininet/host')

var key = process.argv[2]
var dir = tempy.directory()

Dat(dir, {key: key, temp: true}, function (err, dat) {
  if (err) throw err
  // dat.joinNetwork()

        var network = dat.joinNetwork(function () {
          console.log('joinNetwork calls back okay')
        })
        network.once('connection', function () {
          console.log('connects via network')
				})

  console.log('Downloading dat://' + key)
  mn.send('setvar', {dir: dir})

  var archive = dat.archive
  if (archive.content) contentReady()
  archive.once('content', contentReady)

  function contentReady () {
  	console.log('content ready')
    archive.content.on('sync', function () {
    	console.log('sunc')
    	mn.send('ready')
    })
	}
})