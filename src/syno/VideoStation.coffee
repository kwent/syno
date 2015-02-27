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
    # search
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
    # search
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
    # search
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
    # search
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
    # search
    # edit
    
    listTVRecording: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.TVRecording'
                version: 1
                path: 'VideoStation/tvrecord.cgi'
                method: 'list'
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
    # search
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
        
    getCollectionInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.VideoStation.Collection'
                version: 1
                path: 'VideoStation/collection.cgi'
                method: 'getinfo'
        }
        
    # SYNO.VideoStation.Metadata (VideoStation/metadata.cgi)
    
    listMetadatas: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Metadata'
                version: 1
                path: 'VideoStation/metadata.cgi'
                method: 'list'
        }
        
    # SYNO.VideoStation.Poster (VideoStation/poster.cgi)
    # TODO
    # getimage
    # setimage

    # SYNO.VideoStation.Rating (VideoStation/rating.cgi)
    
    getRatingInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.VideoStation.Rating'
                version: 1
                path: 'VideoStation/rating.cgi'
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
                version: 1
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