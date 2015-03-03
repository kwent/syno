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
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.Camera'
                version: 8
                path: 'entry.cgi'
                method: 'Enable'
        }

    disableCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
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
            requiredParams: [ 'cameraIds', 'direction' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Move'
        }

    zoomPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Zoom'
        }

    listPTZCameraPresets: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'ListPreset'
        }

    goPTZCameraToPreset: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'GoPreset'
        }
        
    listPTZCameraPatrols: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'ListPatrol'
        }

    runPTZCameraPatrol: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds', 'patrolId' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'RunPatrol'
        }

    getPTZCameraPatrolsSchedule: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'GetPatrolSchedule'
        }

    focusPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Focus'
        }
        
    irisPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds', 'control' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'Iris'
        }

    autoFocusPTZCamera: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.PTZ'
                version: 3
                path: 'entry.cgi'
                method: 'AutoFocus'
        }

    movePTZCameraToAbsolutePosition: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'cameraIds', 'posX', 'posY' ]
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
            requiredParams: [ 'cameraIds', 'action' ]
            apiInfos:
                api: 'SYNO.SurveillanceStation.ExternalRecording'
                version: 2
                path: 'entry.cgi'
                method: 'Record'
        }
    
    # SYNO.SurveillanceStation.Event
    # TODO
    # Query
    # DeleteMulti
    # DeleteFilter
    # DeleteAll

    # SYNO.SurveillanceStation.Device
    # TODO
    # ListVS
    # ListCMS
    # GetServiceSetting

    # SYNO.SurveillanceStation.Emap
    # TODO
    # List
    # GetInfo
    # GetImage

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
    
    # SYNO.SurveillanceStation.Notification
    # TODO
    # GetRegisterToken