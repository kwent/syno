Syno = require('../../dist/syno.js')

module.exports =
  
    setUp: (callback)->
        @syno = new Syno(
            protocol: 'https'
            host: 'kwentakill.synology.me'
            port: '5001'
            account: 'travis'
            passwd: 'travis')
          
        @syno.auth.login
        callback()
        return

    tearDown: (callback)->
        @syno.auth.logout
        callback()
        return

    # Cannot be tested against demo.synology.com cause no DTV Dongle.