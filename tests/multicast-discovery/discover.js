var test = require('tapenet')

var {h1, h2} = test.topologies.basic()

test('base mdns', function (t) {
  t.plan(3 + 1 + 3 + 1)

  t.run(h1, () => {
    var dns = require('multicast-dns')()

    dns.once('query', function (query) {
      t.same(query.questions.length, 1)
      t.same(query.questions[0].type, 'A')
      t.same(query.questions[0].name, 'hello.local')
      dns.response({
        answers: [{
          type: 'A',
          name: 'hello.local',
          data: '127.0.0.1'
        }]
      }, err => t.error(err, 'no response error'))
    })

    h1.emit('ready')
  })

  t.run(h2, () => {
    var dns = require('multicast-dns')()

    h1.on('ready', function () {
      dns.once('response', function (response) {
        t.same(response.answers[0].type, 'A')
        t.same(response.answers[0].name, 'hello.local')
        t.same(response.answers[0].data, '127.0.0.1')
      })
      dns.query({
        questions: [{
          type: 'A',
          name: 'hello.local'
        }]
      }, err => t.error(err, 'no query error'))
    })
  })
})

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
