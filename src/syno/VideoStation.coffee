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
    
    # SYNO.DTV.ChannelScan (VideoStation/channelscan.cgi)
    # TODO
    # getcountry
    # getregion
    # getconfig
    # start
    # stop
    # status

    # SYNO.DTV.DVBSScan (VideoStation/dvbsscan.cgi)
    # TODO
    # getconfig
    # get_satellite
    # create_satellite
    # edit_satellite
    # delete_satellite
    # get_lnb
    # create_lnb
    # edit_lnb
    # delete_lnb
    # get_tp
    # get_tp_default
    # save_tp
    # start
    # stop
    # status

    # SYNO.DTV.Channel (VideoStation/channellist.cgi)
    # TODO
    # delete_all_channels
    # edit
    
    listDTVChannels: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Channel'
                version: 1
                path: 'VideoStation/channellist.cgi'
                method: 'list'
        }
    
    getDTVChannelsInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Channel'
                version: 1
                path: 'VideoStation/channellist.cgi'
                method: 'getinfo'
        }
        
    # SYNO.DTV.Program (VideoStation/programlist.cgi)
    # TODO
    # search
    # update
    
    listDTVPrograms: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Program'
                version: 1
                path: 'VideoStation/programlist.cgi'
                method: 'list'
        }
            
    # SYNO.DTV.Schedule (VideoStation/schedule_recording.cgi)
    # TODO
    # create
    # delete
    # delete_passed
    # create_repeat
    # getinfo_repeat
    # edit_repeat
    # delete_repeat
    # getinfo_userdefine
    # create_userdefine
    # edit_userdefine
    # delete_userdefine

    listDTVSchedules: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Schedule'
                version: 1
                path: 'VideoStation/schedule_recording.cgi'
                method: 'list'
        }
        
    # SYNO.DTV.Status (VideoStation/dvtstatus.cgi)
    
    getDTVStatusInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Status'
                version: 1
                path: 'VideoStation/dvtstatus.cgi'
                method: 'getinfo'
        }
        
    # SYNO.DTV.Controller (VideoStation/dtvcontrol.cgi)
    # TODO
    # getchannel
    # setchannel
    
    # SYNO.DTV.Streaming (VideoStation/dtvstreaming.cgi)
    # TODO
    # open
    # stream
    # close

    # SYNO.DTV.Statistic (VideoStation/dtvstatistic.cgi)
    
    getDTVStatisticsInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Statistic'
                version: 1
                path: 'VideoStation/dtvstatistic.cgi'
                method: 'getinfo'
        }

    # SYNO.DTV.Tuner (VideoStation/tuner.cgi)
    
    listDTVTuners: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DTV.Tuner'
                version: 1
                path: 'VideoStation/tuner.cgi'
                method: 'list'
        }
        
    
    getDTVTunerInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.DTV.Tuner'
                version: 1
                path: 'VideoStation/tuner.cgi'
                method: 'getinfo'
        }
        
    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered