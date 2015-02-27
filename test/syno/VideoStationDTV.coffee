Syno = require('../../dist/syno.js')

module.exports =
  
    setUp: (callback)->
        @syno = new Syno(
            protocol: 'https'
            host: 'demo.synology.com'
            port: '5001'
            account: 'admin'
            passwd: 'synology')
          
        @syno.auth.login
        callback()
        return

    tearDown: (callback)->
        @syno.auth.logout
        callback()
        return

    listDTVChannels: (test)->
        @syno.dtv.listDTVChannels (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVChannelsInfo: (test)->
        @syno.dtv.getDTVChannelsInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVPrograms: (test)->
        @syno.dtv.listDTVPrograms (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVSchedules: (test)->
        @syno.dtv.listDTVSchedules (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVTuners: (test)->
        @syno.dtv.listDTVTuners (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVTunerInfo: (test)->
        @syno.dtv.getDTVTunerInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getDTVStatusInfo: (test)->
        @syno.dtv.getDTVStatusInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVStatisticsInfo: (test)->
        @syno.dtv.getDTVStatisticsInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return