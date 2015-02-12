#!/usr/bin/env node

CONFIG_DIR = '.syno'
CONFIG_FILE = 'config.yaml'
DEFAULT_PROTOCOL = 'https'
DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 5001
DEFAULT_ACCOUNT = 'admin'
DEFAULT_PASSWD = 'password'

program = require('commander')
fs = require('fs')
url = require('url')
nconf = require('nconf')
path = require('path-extra');
yaml = require('js-yaml');
Syno = require('../dist/syno')
os = require('os')

execute = (api, cmd, options) ->
    console.log "[DEBUG] : Method name configured : %s", cmd if program.debug
    console.log "[DEBUG] : JSON payload configured : %s", options.payload if options.payload and program.debug
    console.log '[DEBUG] : Prettify output detected' if options.pretty and program.debug
    
    try
      payload = JSON.parse(options.payload || '{}')
    catch exception
      console.log "[ERROR] : JSON Exception : %s", exception
      process.exit 1
    
    syno[api][cmd] payload, (err, data) ->
      console.log "[ERROR] : %s", err if err
      if options.pretty
        data = JSON.stringify data, undefined, 2
      else
        data = JSON.stringify data
      console.log data if data
      syno.auth.logout()
      process.exit 0

program
.version('1.0.1')
.description('Synology Rest API Command Line') 
.option('-c, --config <path>', "DSM Configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>', "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option('-d, --debug', 'Enabling Debugging Output')
.on '--help', ->
  console.log '  Commands:'
  console.log ''
  console.log '    filestation|fs [options] <method>  DSM File Station API'
  console.log '    downloadstation|dl [options] <method>  DSM Download Station API'
  console.log ''
.on '--help', ->
  console.log '  Examples:'
  console.log ''
  console.log '    $ syno filestation|fs getFileStationInfo'
  console.log '    $ syno downloadstation|dl getDownloadStationInfo'
  console.log ''

program.parse process.argv

if program.args.length == 0
  program.help()
else if (program.args.length > 0 and
          program.args[0] != 'filestation' and program.args[0] != 'downloadstation' and
          program.args[0] != 'fs' and program.args[0] != 'dl')
  console.log ''
  console.log "  [ERROR] : #{program.args[0]} is not a valid command !"
  console.log ''
  console.log '  Examples:'
  console.log ''
  console.log '    $ syno filestation|fs [options] <method> DSM File Station API'
  console.log '    $ syno downloadstation|dl [options] <method> DSM Download Station API'
  console.log ''
  process.exit 1

# Load cmd line args and environment vars
nconf.argv.env

if program.url
  console.log "[DEBUG] : Params URL detected : %s.", program.url if program.debug
  
  url_resolved = url.parse program.url
  url_resolved = url.parse DEFAULT_PROTOCOL + "://" + program.url if !url_resolved.protocol  
  url_resolved.protocol = url_resolved.protocol.slice(0,-1)
  
  if url_resolved.protocol != 'http' and
    url_resolved.protocol != 'https'
      console.log "[ERROR] : Invalid Protocol URL detected : %s.", url_resolved.protocol
      process.exit 1 
    
  nconf.overrides
    url:
      protocol: url_resolved.protocol
      host: url_resolved.hostname || DEFAULT_HOST
      port: url_resolved.port || DEFAULT_PORT
      account: if url_resolved.auth then url_resolved.auth.split(':')[0] else DEFAULT_ACCOUNT
      passwd: if url_resolved.auth then url_resolved.auth.split(':')[1] else DEFAULT_PASSWD
else if program.config
  console.log "[DEBUG] : Load config file : %s", program.config if program.debug
  # load a yaml file specified in config
  if fs.existsSync(program.config)
      nconf.file
        file: program.config
        format:
          stringify: (obj, options) ->
            yaml.safeDump obj, options
          parse: (obj, options) ->
            yaml.safeLoad obj, options
  else
    console.log "[ERROR] : Config file : %s not found", program.config
    process.exit 1
else
  
  # If no directory -> create directory and save the file
  if !fs.existsSync path.homedir() + "/#{CONFIG_DIR}"
    console.log "[DEBUG] : Default configuration file doesn't exist : %s", path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
    fs.mkdir path.homedir() + "/#{CONFIG_DIR}", (err) ->
      if err
        console.log "[ERROR] : %s", err
      else
        nconf.set('url:protocol', DEFAULT_PROTOCOL)
        nconf.set('url:host', DEFAULT_HOST)
        nconf.set('url:port', DEFAULT_PORT)
        nconf.set('url:account', DEFAULT_ACCOUNT)
        nconf.set('url:passwd', DEFAULT_PASSWD)
        console.log "[DEBUG] : Default configuration file created : %s", path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
        nconf.save()
  
  # Load a yaml file using YAML formatter
  console.log "[DEBUG] : Default configuration file loaded : ~/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
  nconf.file
    file: path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}"
    format:
      stringify: (obj, options) ->
        yaml.safeDump obj, options
      parse: (obj, options) ->
        yaml.safeLoad obj, options
    
nconf.defaults
  url:
    protocol: DEFAULT_PROTOCOL
    host : DEFAULT_HOST
    port : DEFAULT_PORT
    account : DEFAULT_ACCOUNT
    passwd : DEFAULT_PASSWD

console.log "[DEBUG] : DSM Connection URL configured : %s://%s:%s@%s:%s", nconf.get('url:protocol'), nconf.get('url:account'), nconf.get('url:passwd'), nconf.get('url:host'), nconf.get('url:port') if program.debug
syno = new Syno(
  protocol: nconf.get('url:protocol')
  host: nconf.get('url:host')
  port: nconf.get('url:port')
  account: nconf.get('url:account')
  passwd: nconf.get('url:passwd'))
  
program
.command('filestation <method>')
.alias('fs')
.description('DSM File Station API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>', "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option("-p, --payload <payload>", "JSON Payload")
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.on '--help', ->
  console.log '  Examples:'
  console.log ''
  console.log '    $ syno filestation|fs listSharedFolders'
  console.log '    $ syno filestation|fs listFiles --pretty --payload \'{"folder_path":"/path/to/folder"}\''
  console.log ''
.action (cmd, options) ->
  console.log "[DEBUG] : DSM File Station API command selected" if program.debug
  execute 'fs', cmd, options

program
.command('downloadstation <method>')
.alias('dl')
.description('DSM Download Station API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>', "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option("-p, --payload <payload>", "JSON Payload")
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.on '--help', ->
  console.log '  Examples:'
  console.log ''
  console.log '    $ syno downloadstation|dl createTask --payload \'{"uri":"magnet|ed2k|ftp(s)|http(s)://link"}\''
  console.log '    $ syno downloadstation|dl listTasks'
  console.log '    $ syno downloadstation|dl listTasks --payload \'{"limit":1}\''
  console.log '    $ syno downloadstation|dl getTasksInfo --pretty --payload \'{"id":"task_id"}\''
  console.log ''
.action (cmd, options) ->
  console.log "[DEBUG] : DSM Download Station API command selected" if program.debug
  execute 'dl', cmd, options
  
program.parse process.argv