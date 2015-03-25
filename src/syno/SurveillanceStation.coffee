class SurveillanceStation extends AuthenticatedAPI

    # SYNO.SurveillanceStation.Info (entry.cgi)
    
    getSurveillanceStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Info'
                version: 1
                path: 'entry.cgi'
                method: 'GetInfo'
        }

    # SYNO.SurveillanceStation.Camera (entry.cgi)
    # TODO
    # GetSnapshot
    
    listCameras: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'List'
        }
        
    getCameraInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'GetInfo'
        }

    getCameraCapability: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'vendor', 'model' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'GetCapability'
        }

    getCameraCapabilityById: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'GetCapabilityByCamId'
        }

    listCameraGroups: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'ListGroup'
        }
        
    enableCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'Enable'
        }

    disableCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'Disable'
        }
    
    # SYNO.SurveillanceStation.PTZ (entry.cgi)
    
    movePTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'direction' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Move'
        }

    zoomPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Zoom'
        }

    listPTZCameraPresets: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'ListPreset'
        }

    goPTZCameraToPreset: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'GoPreset'
        }
        
    listPTZCameraPatrols: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'ListPatrol'
        }

    runPTZCameraPatrol: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'patrolId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'RunPatrol'
        }

    getPTZCameraPatrolsSchedule: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'GetPatrolSchedule'
        }

    focusPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Focus'
        }
        
    irisPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Iris'
        }

    autoFocusPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'AutoFocus'
        }

    movePTZCameraToAbsolutePosition: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'posX', 'posY' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'AbsPtz'
        }
        
    # SYNO.SurveillanceStation.ExternalRecording (entry.cgi)

    recordCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraId', 'action' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.ExternalRecording'
                version: 2
                path: 'entry.cgi'
                method: 'Record'
        }
    
    # SYNO.SurveillanceStation.Event (entry.cgi)
    
    queryEvents: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Event'
                version: 3
                path: 'entry.cgi'
                method: 'Query'
        }

    deleteMultiEvents: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'idList' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Event'
                version: 3
                path: 'entry.cgi'
                method: 'DeleteMulti'
        }

    deleteEventFilter: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Event'
                version: 3
                path: 'entry.cgi'
                method: 'DeleteFilter'
        }

    deleteAllEvents: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Event'
                version: 3
                path: 'entry.cgi'
                method: 'DeleteAll'
        }
        
    # SYNO.SurveillanceStation.Device (SurveillanceStation/device.cgi)
    
    listVisualStationsDevices: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Device'
                version: 2
                path: 'SurveillanceStation/device.cgi'
                method: 'ListVS'
        }

    listSlaveDSDevices: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Device'
                version: 2
                path: 'SurveillanceStation/device.cgi'
                method: 'ListCMS'
        }

    getServiceSettingDevice: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Device'
                version: 2
                path: 'SurveillanceStation/device.cgi'
                method: 'GetServiceSetting'
        }

    # SYNO.SurveillanceStation.Emap
    # TODO
    # GetImage

    listEmaps: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Emap'
                version: 1
                path: 'SurveillanceStation/emap.cgi'
                method: 'List'
        }

    getEmapInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'emapIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Emap'
                version: 1
                path: 'SurveillanceStation/emap.cgi'
                method: 'GetInfo'
        }

    # SYNO.SurveillanceStation.Streaming
    # TODO
    # LiveStream
    # EventStream

    # SYNO.SurveillanceStation.AudioStream
    # TODO
    # Stream
    # Query
    # Open
    # Close

    # SYNO.SurveillanceStation.VideoStream
    # TODO
    # Stream
    # Query
    # Open
    # Close
    
    # SYNO.SurveillanceStation.Notification (entry.cgi)

    getNotificationRegisterToken: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.SurveillanceStation.Notification'
                version: 1
                path: 'entry.cgi'
                method: 'GetRegisterToken'
        }

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered
            
    # Handle Surveillance Station specific errors
    error: (code, api)->
        # Task API specific errors
        if api is 'SYNO.SurveillanceStation.Camera' or 'SYNO.SurveillanceStation.PTZ'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Parameter invalid'
                when 402 then return 'Camera disabled'
        # Event API specific errors
        if api is 'SYNO.SurveillanceStation.Event' or 'SYNO.SurveillanceStation.Emap'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Parameter invalid'
        # Device API specific errors
        if api is 'SYNO.SurveillanceStation.Device'
            switch code
                when 400 then return 'Execution failed'
                when 401 then return 'Service is not enabled'
        # Device API specific errors
        if api is 'SYNO.SurveillanceStation.Notification'
            switch code
                when 400 then return 'Execution failed'
        # Did not find any specifi error, so call super function
        return super