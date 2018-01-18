var test = require('tapenet')

var {h1, h2} = test.topologies.basic()

test('listening node (h1) discovers announcing node (h2)', function (t) {
  t.run(h1, () => {
    var discovery = require('dns-discovery')
    var disc = discovery({
      multicast: true,
      server: false
    })
    disc.on('peer', (name, peer) => {
      t.same(name, 'test-app')
      t.same(peer.port, 9090)
      t.notEqual(peer.host, ip)
      t.ok(typeof peer.host === 'string')
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
