class DSM extends AuthenticatedAPI

    # SYNO.DSM.Info (entry.cgi)
    
    getDSMInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.Info'
                version: 2
                path: 'entry.cgi'
                method: 'getinfo'
        }

    # SYNO.DSM.FindMe (entry.cgi)
    
    isFindMeSupported: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.FindMe'
                version: 2
                path: 'entry.cgi'
                method: 'supported'
        }

    startFindMe: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.FindMe'
                version: 2
                path: 'entry.cgi'
                method: 'start'
        }

    stopFindMe: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.FindMe'
                version: 2
                path: 'entry.cgi'
                method: 'stop'
        }

    # SYNO.DSM.Network (entry.cgi)
    
    listNetwork: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.Network'
                version: 2
                path: 'entry.cgi'
                method: 'list'
        }

    # SYNO.DSM.PortEnable (entry.cgi)
    
    isPortPkgEnabled: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.PortEnable'
                version: 1
                path: 'entry.cgi'
                method: 'is_pkg_enable'
        }

    isPortBlocked: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.PortEnable'
                version: 1
                path: 'entry.cgi'
                method: 'is_port_block'
        }

    openPortBlocked: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.PortEnable'
                version: 1
                path: 'entry.cgi'
                method: 'open_block_port'
        }

    # SYNO.DSM.PushNotification (entry.cgi)
    
    requestPushNotificationToken: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.DSM.PushNotification'
                version: 2
                path: 'entry.cgi'
                method: 'requesttoken'
        }

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered