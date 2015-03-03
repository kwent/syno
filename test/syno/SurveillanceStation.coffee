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
    
  getSurveillanceStationInfo: (test)->
      @syno.ss.getSurveillanceStationInfo (error, data)->
          test.ifError error
          test.done()
      return

  listCameras: (test)->
      @syno.ss.listCameras (error, data)->
          test.ifError error
          test.done()
      return

  getCameraInfo: (test)->
      @syno.ss.getCameraInfo {'cameraIds': 4}, (error, data)->
          test.ifError error
          test.done()
      return

  # Not available on demo.synology.com ?
  # Unknown error
  # getCameraCapability: (test)->
  #     @syno.ss.getCameraCapability {'vendor': 'AXIS', 'model': 'P3364-VE'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  getCameraCapabilityById: (test)->
      @syno.ss.getCameraCapabilityById {'cameraId': 4}, (error, data)->
          test.ifError error
          test.done()
      return

  listCameraGroups: (test)->
      @syno.ss.listCameraGroups (error, data)->
          test.ifError error
          test.done()
      return

  # Not available on demo.synology.com
  # disableCamera: (test)->
  #     @syno.ss.disableCamera {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
  
  # Not available on demo.synology.com
  # enableCamera: (test)->
  #     @syno.ss.enableCamera {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
  
  # Not available on demo.synology.com
  # movePTZCamera: (test)->
  #     @syno.ss.movePTZCamera {'cameraId': 4, 'direction': 'right'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # zoomPTZCamera: (test)->
  #     @syno.ss.zoomPTZCamera {'cameraId': 4, 'control': 'in'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
  
  # Not available on demo.synology.com
  # listPTZCameraPresets: (test)->
  #     @syno.ss.listPTZCameraPresets {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
  
  # Not available on demo.synology.com
  # goPTZCameraToPreset: (test)->
  #     @syno.ss.goPTZCameraToPreset {'cameraId': 4, 'presetId': 1}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
      
  # Not available on demo.synology.com
  # listPTZCameraPatrols: (test)->
  #     @syno.ss.listPTZCameraPatrols {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # runPTZCameraPatrol: (test)->
  #     @syno.ss.runPTZCameraPatrol {'cameraId': 4, 'patrolId': 1}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # Error: The requested method does not exist
  # getPTZCameraPatrolsSchedule: (test)->
  #     @syno.ss.getPTZCameraPatrolsSchedule {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # focusPTZCamera: (test)->
  #     @syno.ss.focusPTZCamera {'cameraId': 4, 'control': 'in'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # irisPTZCamera: (test)->
  #     @syno.ss.irisPTZCamera {'cameraId': 4, 'control': 'in'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return

  # Not available on demo.synology.com
  # autoFocusPTZCamera: (test)->
  #     @syno.ss.autoFocusPTZCamera {'cameraId': 4}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
      
  # Not available on demo.synology.com
  # movePTZCameraToAbsolutePosition: (test)->
  #     @syno.ss.movePTZCameraToAbsolutePosition {'cameraId': 4, 'posX': 10, 'posY': 20}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return
  
  # Not available on demo.synology.com
  # recordCamera: (test)->
  #     @syno.ss.recordCamera {'cameraId': 4, 'action': 'start'}, (error, data)->
  #         test.ifError error
  #         test.done()
  #     return