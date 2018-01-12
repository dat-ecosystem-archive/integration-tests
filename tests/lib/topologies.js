var mininet = require('../../lib/mininet')

exports.two = function (create1Cb, create2Cb, readyCb) {
  var top = {}

  top.mn = mininet()
  top.s1 = top.mn.createSwitch()
  top.h1 = top.mn.createHost()
  top.h2 = top.mn.createHost()
  top.h1.link(top.s1)
  top.h2.link(top.s1)
  top.mn.start()

  top.proc1 = startProc(top, 'h1', top.h1, create1Cb, function () {
    top.proc2 = startProc(top, 'h2', top.h2, create2Cb, function () {
      readyCb.call(top)
    })
  })
}

function startProc (top, name, host, createCb, readyCb) {
  var proc = host.nodeSpawn(createCb.call(top))
  proc.vars = {}
  proc.on('message:setvar', function (data) {
    for (var k in data) {
      proc.vars[k] = data[k]
    }
  })
  proc.on('message:ready', function () {
    readyCb()
  })
  proc.on('stdout', function (data) {
    process.stdout.write(name + ' ' + data)
  })
  return proc
}