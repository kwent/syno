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
            test.done()
        return

    listMovies: (test)->
        @syno.vs.listMovies (error, data)->
            test.ifError error
            test.done()
        return

    searchMovie: (test)->
        @syno.vs.searchMovie {'title': 'my_title'}, (error, data)->
            test.ifError error
            test.done()
        return

    getMovieInfo: (test)->
        @syno.vs.getMovieInfo {'id': '1'}, (error, data)->
            test.ifError error
            test.done()
        return

    listTVShows: (test)->
        @syno.vs.listTVShows (error, data)->
            test.ifError error
            test.done()
        return
        
    searchTVShow: (test)->
        @syno.vs.searchTVShow {'title': 'my_title'}, (error, data)->
            test.ifError error
            test.done()
        return
        
    getTVShowInfo: (test)->
        @syno.vs.getTVShowInfo {'id': '1'}, (error, data)->
            test.ifError error
            test.done()
        return

    listTVShowEpisodes: (test)->
        @syno.vs.listTVShowEpisodes (error, data)->
            test.ifError error
            test.done()
        return
        
    searchTVShowEpisode: (test)->
        @syno.vs.searchTVShowEpisode {'title': 'my_title'}, (error, data)->
            test.ifError error
            test.done()
        return
            
    getTVShowEpisodeInfo: (test)->
        @syno.vs.getTVShowEpisodeInfo {'id': '1'}, (error, data)->
            test.ifError error
            test.done()
        return

    listHomeVideos: (test)->
        @syno.vs.listHomeVideos (error, data)->
            test.ifError error
            test.done()
        return
        
    searchHomeVideo: (test)->
        @syno.vs.searchHomeVideo {'title': 'my_title'}, (error, data)->
            test.ifError error
            test.done()
        return
        
    getHomeVideoInfo: (test)->
        @syno.vs.getHomeVideoInfo {'id': '1'}, (error, data)->
            test.ifError error
            test.done()
        return

    listTVRecordings: (test)->
        @syno.vs.listTVRecordings (error, data)->
            test.ifError error
            test.done()
        return

    searchTVRecording: (test)->
        @syno.vs.searchTVRecording {'title': 'my_title'}, (error, data)->
            test.ifError error
            test.done()
        return

    getTVRecordingInfo: (test)->
        @syno.vs.getTVRecordingInfo {'id': '1'}, (error, data)->
            test.ifError error
            test.done()
        return

    listCollections: (test)->
        @syno.vs.listCollections (error, data)->
            test.ifError error
            test.done()
        return
        
    ## Not available on demo.synology.com
    # searchCollection: (test)->
    #     @syno.vs.searchCollection {'title': 'favorite'}, (error, data)->
    #         test.ifError error
    #         test.done()
    #     return
        
    getCollectionInfo: (test)->
        @syno.vs.getCollectionInfo {'id': 1}, (error, data)->
            test.ifError error
            test.done()
        return

    ## Not available on demo.synology.com
    # listMetadatas: (test)->
    #     @syno.vs.listMetadatas {'id': 1}, (error, data)->
    #         test.ifError error
    #         test.done()
    #     return

    ## Not available on demo.synology.com
    # listSubtitles: (test)->
    #     @syno.vs.listSubtitles {'id': 1}, (error, data)->
    #         test.ifError error
    #         test.done()
    #     return

    ## Not available on demo.synology.com
    # listAudioTracks: (test)->
    #     @syno.vs.listAudioTracks {'id': 1}, (error, data)->
    #         test.ifError error
    #         test.done()
    #     return
        
    ## Not available on demo.synology.com
    # listFolders: (test)->
    #     @syno.vs.listFolders (error, data)->
    #         test.ifError error
    #         test.done()
    #     return

    listLibraries: (test)->
        @syno.vs.listLibraries (error, data)->
            test.ifError error
            test.done()
        return

    getWatchStatusInfo: (test)->
        @syno.vs.getWatchStatusInfo {'id': 1}, (error, data)->
            test.ifError error
            test.done()
        return