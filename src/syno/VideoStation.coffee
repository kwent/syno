class VideoStation extends AuthenticatedAPI

    # SYNO.VideoStation.Info (VideoStation/info.cgi)
    
    getVideoStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Info'
                version: 1
                path: 'VideoStation/info.cgi'
                method: 'getinfo'
        }

    # SYNO.VideoStation.Video (VideoStation/video.cgi)
    # TODO
    # download
    
    # SYNO.VideoStation.Movie (VideoStation/movie.cgi)
    # TODO
    # edit
    
    listMovies: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Movie'
                version: 1
                path: 'VideoStation/movie.cgi'
                method: 'list'
        }
        
    searchMovie: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.Movie'
                version: 1
                path: 'VideoStation/movie.cgi'
                method: 'search'
        }
        
    getMovieInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.Movie'
                version: 1
                path: 'VideoStation/movie.cgi'
                method: 'getinfo'
        }

    # SYNO.VideoStation.TVShow (VideoStation/tvshow.cgi)
    # TODO
    # edit
    
    listTVShows: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.TVShow'
                version: 1
                path: 'VideoStation/tvshow.cgi'
                method: 'list'
        }

    searchTVShow: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVShow'
                version: 1
                path: 'VideoStation/tvshow.cgi'
                method: 'search'
        }

    getTVShowInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVShow'
                version: 1
                path: 'VideoStation/tvshow.cgi'
                method: 'getinfo'
        }
        
    # SYNO.VideoStation.TVShowEpisode (VideoStation/tvshow_episode.cgi)
    # TODO
    # edit
    # edit_adv
    
    listTVShowEpisodes: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.TVShowEpisode'
                version: 1
                path: 'VideoStation/tvshow_episode.cgi'
                method: 'list'
        }
        
    searchTVShowEpisode: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVShowEpisode'
                version: 1
                path: 'VideoStation/tvshow_episode.cgi'
                method: 'search'
        }
        
    getTVShowEpisodeInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVShowEpisode'
                version: 1
                path: 'VideoStation/tvshow_episode.cgi'
                method: 'getinfo'
        }
        
    # SYNO.VideoStation.HomeVideo (VideoStation/homevideo.cgi)
    # TODO
    # edit
    
    listHomeVideos: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.HomeVideo'
                version: 1
                path: 'VideoStation/homevideo.cgi'
                method: 'list'
        }

    searchHomeVideo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.HomeVideo'
                version: 1
                path: 'VideoStation/homevideo.cgi'
                method: 'search'
        }
        
    getHomeVideoInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.HomeVideo'
                version: 1
                path: 'VideoStation/homevideo.cgi'
                method: 'getinfo'
        }
        
    # SYNO.VideoStation.TVRecording (VideoStation/tvrecord.cgi)
    # TODO
    # edit
    
    listTVRecordings: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.TVRecording'
                version: 1
                path: 'VideoStation/tvrecord.cgi'
                method: 'list'
        }
        
    searchTVRecording: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVRecording'
                version: 1
                path: 'VideoStation/tvrecord.cgi'
                method: 'search'
        }
        
    getTVRecordingInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.TVRecording'
                version: 1
                path: 'VideoStation/tvrecord.cgi'
                method: 'getinfo'
        }
    
    # SYNO.VideoStation.Collection (VideoStation/collection.cgi)
    # TODO
    # video_list
    # video_getinfo
    # create
    # delete
    # edit
    # addvideo
    # deletevideo

    listCollections: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Collection'
                version: 1
                path: 'VideoStation/collection.cgi'
                method: 'list'
        }
        
    searchCollection: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.VideoStation.Collection'
                version: 1
                path: 'VideoStation/collection.cgi'
                method: 'search'
        }
        
    getCollectionInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.Collection'
                version: 2
                path: 'VideoStation/collection.cgi'
                method: 'getinfo'
        }
        
    # SYNO.VideoStation.Metadata (VideoStation/metadata.cgi)
    
    listMetadatas: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Metadata'
                version: 2
                path: 'VideoStation/metadata.cgi'
                method: 'list'
        }
        
    # SYNO.VideoStation.Poster (VideoStation/poster.cgi)
    # TODO
    # getimage
    # setimage

    # SYNO.VideoStation.Rating (VideoStation/rater.cgi)
    
    getRatingInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Rating'
                version: 1
                path: 'VideoStation/rater.cgi'
                method: 'getinfo'
        }

    # SYNO.VideoStation.Streaming (VideoStation/vtestreaming.cgi)
    # TODO
    # open
    # stream
    # close
    
    # SYNO.VideoStation.PluginSearch (VideoStation/pluginsearch.cgi)
    # TODO
    # start
    # stop
    # list
    # query

    # SYNO.VideoStation.Subtitle (VideoStation/subtitle.cgi)
    # TODO
    # get
    
    listSubtitles: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Subtitle'
                version: 2
                path: 'VideoStation/subtitle.cgi'
                method: 'list'
        }

    # SYNO.VideoStation.Rating (VideoStation/rater.cgi)
    # TODO
    # updateinfo
    
    # SYNO.VideoStation.AudioTrack (VideoStation/audiotrack.cgi)
    
    listAudioTracks: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.AudioTrack'
                version: 1
                path: 'VideoStation/audiotrack.cgi'
                method: 'list'
        }

    # SYNO.VideoStation.Folder (VideoStation/folder.cgi)

    listFolders: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Folder'
                version: 1
                path: 'VideoStation/folder.cgi'
                method: 'list'
        }

    # SYNO.VideoStation.WatchStatus (VideoStation/watchstatus.cgi)
    # TODO
    # setinfo
    
    getWatchStatusInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.WatchStatus'
                version: 1
                path: 'VideoStation/watchstatus.cgi'
                method: 'getinfo'
        }

    # SYNO.VideoStation.Library (VideoStation/library.cgi)

    listLibraries: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Library'
                version: 1
                path: 'VideoStation/library.cgi'
                method: 'list'
        }

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered