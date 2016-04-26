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
      
    getDSMInfo: (test)->
        @syno.dsm.getDSMInfo (error, data)->
            test.ifError error
            test.equal('DS411j', data.model)
            test.done()
        return

    isFindMeSupported: (test)->
        @syno.dsm.isFindMeSupported (error, data)->
            test.ifError error
            test.done()
        return

    startFindMe: (test)->
        @syno.dsm.startFindMe (error, data)->
            test.ifError error
            test.done()
        return

    stopFindMe: (test)->
        @syno.dsm.stopFindMe (error, data)->
            test.ifError error
            test.done()
        return

    listNetwork: (test)->
        @syno.dsm.listNetwork (error, data)->
            test.ifError error
            test.equal('Kwentology', data.hostname)
            test.done()
        return

    # Unknown error

    # isPortPkgEnabled: (test)->
    #     @syno.dsm.isPortPkgEnabled (error, data)->
    #         test.ifError error
    #         console.log(data)
    #         test.done()
    #     return
    #
    # isPortBlocked: (test)->
    #     @syno.dsm.isPortBlocked (error, data)->
    #         test.ifError error
    #         console.log(data)
    #         test.done()
    #     return

    requestPushNotificationToken: (test)->
        @syno.dsm.requestPushNotificationToken (error, data)->
            test.ifError error
            test.ok(data.token)
            test.done()
        return