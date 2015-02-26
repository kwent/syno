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

    getVideoStationInfo: (test)->
        @syno.vs.getVideoStationInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listMovies: (test)->
        @syno.vs.listMovies (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getMovieInfo: (test)->
        @syno.vs.getMovieInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listTVShows: (test)->
        @syno.vs.listTVShows (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getTVShowInfo: (test)->
        @syno.vs.getTVShowInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listTVShowEpisodes: (test)->
        @syno.vs.listTVShowEpisodes (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getTVShowEpisodeInfo: (test)->
        @syno.vs.getTVShowEpisodeInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listHomeVideos: (test)->
        @syno.vs.listHomeVideos (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getHomeVideoInfo: (test)->
        @syno.vs.getHomeVideoInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listTVRecording: (test)->
        @syno.vs.listTVRecording (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getTVRecordingInfo: (test)->
        @syno.vs.getTVRecordingInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listCollections: (test)->
        @syno.vs.listCollections (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getCollectionInfo: (test)->
        @syno.vs.getCollectionInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listMetadatas: (test)->
        @syno.vs.listMetadatas (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listSubtitles: (test)->
        @syno.vs.listSubtitles (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listAudioTracks: (test)->
        @syno.vs.listAudioTracks (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listFolders: (test)->
        @syno.vs.listFolders (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listLibraries: (test)->
        @syno.vs.listLibraries (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getRatingInfo: (test)->
        @syno.vs.getRatingInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getWatchStatusInfo: (test)->
        @syno.vs.getWatchStatusInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVChannels: (test)->
        @syno.vs.listDTVChannels (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVChannelsInfo: (test)->
        @syno.vs.getDTVChannelsInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVPrograms: (test)->
        @syno.vs.listDTVPrograms (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVSchedules: (test)->
        @syno.vs.listDTVSchedules (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    listDTVTuners: (test)->
        @syno.vs.listDTVTuners (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVTunerInfo: (test)->
        @syno.vs.getDTVTunerInfo {'id': '1'}, (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return

    getDTVStatusInfo: (test)->
        @syno.vs.getDTVStatusInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return
        
    getDTVStatisticsInfo: (test)->
        @syno.vs.getDTVStatisticsInfo (error, data)->
            test.ifError error
            console.log error if error
            console.log data if data
            test.done()
        return