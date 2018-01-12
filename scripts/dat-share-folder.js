var Dat = require('dat-node')
var mn = require('mininet/host')

Dat(process.argv[2], {temp: true}, function (err, dat) {
  if (err) throw err
  dat.importFiles()
  // dat.joinNetwork()

        var network = dat.joinNetwork(function () {
          console.log('joinNetwork calls back okay')
        })
        network.once('connection', function () {
          console.log('connects via network')
				})
  console.log('Sharing dat://' + dat.key.toString('hex'))
  mn.send('setvar', {key: dat.key.toString('hex')})
	mn.send('ready')
})