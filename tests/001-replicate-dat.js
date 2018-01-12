var topologies = require('./lib/topologies')

topologies.two(
  function () {
    return 'scripts/dat-share-folder.js fixtures/dat1'
  },
  function () {
    return 'scripts/dat-download-folder.js ' + this.proc1.vars.key
  },
  function () {
    console.log('proc1.vars', this.proc1.vars)
    console.log('proc2.vars', this.proc2.vars)
    this.mn.stop()
  }
)