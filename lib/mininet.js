var mininet = require('mininet')

var NODE_PATH = process.env.NODE_PATH || 'node'
var DEBUG = process.env.DEBUG

module.exports = function () {
  var mn = mininet()

  // monkeypatch createHost to modify hosts
  var createHost = mn.createHost
  mn.createHost = function () {
    var host = createHost.call(mn)

    // add nodeSpawn() helper
    host.nodeSpawn = function (params) {
      return host.spawn('DEBUG=' + DEBUG + ' ' + NODE_PATH + ' ' + params)
    }

    return host
  }

  return mn
}