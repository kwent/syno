Syno = require('../../dist/syno.js')

synoWithValidCredentials = new Syno(
    protocol: 'https'
    host: 'kwentakill.synology.me'
    port: '5001'
    account: 'travis'
    passwd: 'travis')
  
synoWithNotValidCredentials = new Syno(
    protocol: 'https'
    host: 'kwentakill.synology.me'
    port: '5001'
    account: 'travis'
    passwd: 'wrong_password')
  
exports.loginWithValidCredentials = (test)->
    synoWithValidCredentials.auth.login (error, data)->
        test.ifError error
        test.done()
    return
  
exports.logoutWithValidCredentials = (test)->
    synoWithValidCredentials.auth.logout (error, data)->
        test.ifError error
        test.done()
    return
  
exports.loginWithNotValidCredentials = (test)->
    synoWithNotValidCredentials.auth.login (error, data)->
        test.notEqual error, null
        test.done()
    return