class VideoStationDTV extends AuthenticatedAPI
  
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