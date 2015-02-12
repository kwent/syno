Syno = require('../../dist/syno.js')

synoWithValidCredentials = new Syno(
  protocol: 'https'
  host: 'demo.synology.com'
  port: '5001'
  account: 'admin'
  passwd: 'synology')
  
synoWithNotValidCredentials = new Syno(
  protocol: 'https'
  host: 'demo.synology.com'
  port: '5001'
  account: 'admin'
  passwd: 'wrong_password')
  
exports.loginWithValidCredentials = (test) ->
  synoWithValidCredentials.auth.login (error, data) ->
    test.ifError error
    test.done()
  return
  
exports.logoutWithValidCredentials = (test) ->
  synoWithValidCredentials.auth.logout (error, data) ->
    test.ifError error
    test.done()
  return
  
exports.loginWithNotValidCredentials = (test) ->
  synoWithNotValidCredentials.auth.login (error, data) ->
    test.notEqual error, null
    test.done()
  return