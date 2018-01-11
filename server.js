var http = require('http')
var mn = require('mininet/host')

var server = http.createServer(function (req, res) {
  console.log('Server responding')
  res.end('hello from server\n')
})

server.listen(10000, function () {
  console.log('Server listening on', this.address().port)
  mn.send('listening') // msg the host
})