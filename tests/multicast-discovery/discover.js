var test = require('tapenet')

var h1 = test.createHost()
var h2 = test.createHost()
var s1 = test.createSwitch()

h1.link(s1)
h2.link(s1)

test('listening node (h1) discovers announcing node (h2)', function (t) {
  t.run(h1, () => {
    var discovery = require('dns-discovery')
    var disc = discovery({
      multicast: true,
      server: false
    })
    disc.on('peer', (name, peer) => {
      t.ok(name, 'test-app')
      console.log(name, peer)
      t.end()
    })
    h1.emit('ready')
  })

  t.run(h2, () => {
    var discovery = require('dns-discovery')
    h1.on('ready', () => {
      var disc = discovery({
        multicast: true,
        server: false
      })
      disc.announce('test-app', 9090)
    })
  })
})