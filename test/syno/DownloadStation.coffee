Syno = require('../../dist/syno.js')

module.exports =
  
  setUp: (callback)->
      @syno = new Syno(
          protocol: 'https'
          host: 'kwentakill.synology.me'
          port: '5001'
          account: 'travis'
          passwd: 'travis')
        
      @syno.auth.login
      callback()
      return
    
  tearDown: (callback)->
      @syno.auth.logout
      callback()
      return
    
  getDownloadStationInfo: (test)->
      @syno.dl.getDownloadStationInfo (error, data)->
          test.ifError error
          test.done()
      return
    
  getDownloadStationConfig: (test)->
      @syno.dl.getDownloadStationConfig (error, data)->
          test.ifError error
          test.done()
      return
    
  setDownloadStationConfig: (test)->
      @syno.dl.setDownloadStationConfig {'emule_enabled': true} , (error, data)->
          test.ifError error
          test.done()
      return
  
  getScheduleConfig: (test)->
      @syno.dl.getScheduleConfig (error, data)->
          test.ifError error
          test.done()
      return
    
  setScheduleConfig: (test)->
      @syno.dl.setScheduleConfig {'emule_enabled': true} , (error, data)->
          test.ifError error
          test.done()
      return
    
  createTask: (test)->
      @syno.dl.createTask {
      'uri': 'http://mywebsite.com/file.txt',
      'username': 'username',
      'password': 'password'}, (error, data) ->
          test.ifError error
          test.done()
      return
    
  listTasks: (test)->
      @syno.dl.listTasks (error, data)->
          test.ifError error
          test.done()
      return

    # TODO
    #
    # getTasksInfo
    #
    # createTask
    #
    # deleteTasks
    #
    # pauseTasks
    #
    # resumeTasks
    #
    # editTasks