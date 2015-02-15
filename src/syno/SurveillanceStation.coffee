AuthenticatedAPI = mod syno.AuthenticatedAPI

class SurveillanceStation extends AuthenticatedAPI

    getSurveillanceStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: "SYNO.SurveillanceStation.Info"
                version: 1
                path: "SurveillanceStation/info.cgi"
                method: "getinfo"
        }