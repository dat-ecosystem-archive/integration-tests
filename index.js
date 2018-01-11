var mininet = require('mininet')

var NODE_PATH = process.env.NODE_PATH || 'node'
var mn = mininet()

// create a switch
var s1 = mn.createSwitch()

// create some hosts
var h1 = mn.createHost()
var h2 = mn.createHost()

// link them to the switch
h1.link(s1)
h2.link(s1)

// start the network
mn.start()

// run a server in node
var proc = h1.spawn(NODE_PATH + ' server.js')

proc.on('message:listening', function () {
  // when h1 signals it is listening, run curl
  var proc2 = h2.spawn('curl --silent ' + h1.ip + ':10000')

  proc2.on('stdout', function (data) {
    process.stdout.write('h2 ' + data)
    mn.stop() // stop when h2 messages
  })
})

proc.on('stdout', function (data) {
  process.stdout.write('h1 ' + data)
})