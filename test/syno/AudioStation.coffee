Syno = require('../../dist/syno.js')

module.exports =
  
  setUp: (callback) ->
    @syno = new Syno(
      protocol: 'https'
      host: 'demo.synology.com'
      port: '5001'
      account: 'admin'
      passwd: 'synology')
      
    @syno.auth.login
    callback()
    return
    
  tearDown: (callback) ->
    @syno.auth.logout
    callback()
    return
    
  getAudioStationInfo: (test) ->
    @syno.as.getAudioStationInfo (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listAlbums: (test) ->
    @syno.as.listAlbums (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listComposers: (test) ->
    @syno.as.listComposers (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listGenres: (test) ->
    @syno.as.listGenres (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listArtists: (test) ->
    @syno.as.listArtists (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
      
  listFolders: (test) ->
    @syno.as.listFolders (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listSongs: (test) ->
    @syno.as.listSongs (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  searchSong: (test) ->
    @syno.as.searchSong {'title' : 'Victoria'}, (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listRadios: (test) ->
    @syno.as.listRadios (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listPlaylists: (test) ->
    @syno.as.listPlaylists (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listRemotePlayers: (test) ->
    @syno.as.listRemotePlayers (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return
    
  listMediaServers: (test) ->
    @syno.as.listMediaServers (error, data) ->
      test.ifError error
      console.log error if error
      console.log data if data
      test.done()
    return