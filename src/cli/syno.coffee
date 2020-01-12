CONFIG_DIR = '.syno'
CONFIG_FILE = 'config.yaml'
DEFAULT_PROTOCOL = 'https'
DEFAULT_HOST = 'localhost'
DEFAULT_PORT = 5001
DEFAULT_ACCOUNT = 'admin'
DEFAULT_PASSWD = 'password'
DEFAULT_API_VERSION = '6.2.2'

program = require 'commander'
fs = require 'fs'
url = require 'url'
nconf = require 'nconf'
ospath = require 'ospath'
yaml = require 'js-yaml'
Syno = require '../dist/syno'
os = require 'os'

execute = (api, cmd, options)->
    console.log '[DEBUG] : Method name configured : %s', cmd if program.debug
    console.log '[DEBUG] : JSON payload configured : %s', options.payload if options.payload and program.debug
    console.log '[DEBUG] : Prettify output detected' if options.pretty and program.debug

    try
        payload = JSON.parse(options.payload or '{}')
    catch exception
        console.log '[ERROR] : JSON Exception : %s', exception
        process.exit 1

    syno[api][cmd] payload, (err, data) ->
        console.log '[ERROR] : %s', err if err
        if options.pretty
            data = JSON.stringify data, undefined, 2
        else
            data = JSON.stringify data
        console.log data if data
        syno.auth.logout()
        process.exit 0

show_methods_available = (api)->
    console.log '  Available methods:'
    console.log ''
    syno[api]['getMethods'] {}, (data) ->
        console.log "    $ syno #{api} #{method}" for method in data
        console.log '    None' if data.length is 0
    console.log ''

main = program
.version '2.2.0'
.description 'Synology Rest API Command Line'
.option '-c, --config <path>', "DSM Configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-u, --url <url>',
    "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}"
.option '-d, --debug', 'Enabling Debugging Output'
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Commands:'
    console.log ''
    console.log '    diskstationmanager|dsm [options] <method> DSM API'
    console.log '    filestation|fs [options] <method> DSM File Station API'
    console.log '    downloadstation|dl [options] <method> DSM Download Station API'
    console.log '    audiostation|as [options] <method> DSM Audio Station API'
    console.log '    videostation|vs [options] <method> DSM Video Station API'
    console.log '    videostationdtv|dtv [options] <method> DSM Video Station DTV API'
    console.log '    surveillancestation|ss [options] <method> DSM Surveillance Station API'
    console.log ''
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno diskstationmanager|dsm getInfo'
    console.log '    $ syno filestation|fs getInfo'
    console.log '    $ syno downloadstation|dl getInfo'
    console.log '    $ syno audiostation|as getInfo'
    console.log '    $ syno videostation|vs getInfo'
    console.log '    $ syno videostationdtv|dtv listChannels --payload \'{"limit":5}\' --pretty'
    console.log '    $ syno surveillancestation|ss getInfo'
    console.log ''

program.parse process.argv

if program.args.length is 0
    program.help()
else if (program.args.length > 0 and
          program.args[0] isnt 'diskstationmanager' and
          program.args[0] isnt 'filestation' and
          program.args[0] isnt 'downloadstation' and
          program.args[0] isnt 'audiostation' and
          program.args[0] isnt 'videostation' and
          program.args[0] isnt 'videostationdtv' and
          program.args[0] isnt 'surveillancestation' and
          program.args[0] isnt 'dsm' and
          program.args[0] isnt 'fs' and
          program.args[0] isnt 'dl' and
          program.args[0] isnt 'as' and
          program.args[0] isnt 'vs' and
          program.args[0] isnt 'dtv' and
          program.args[0] isnt 'ss')
    console.log ''
    console.log "  [ERROR] : #{program.args[0]} is not a valid command !"
    console.log ''
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno diskstationmanager|dsm [options] <method> DSM API'
    console.log '    $ syno filestation|fs [options] <method> DSM File Station API'
    console.log '    $ syno downloadstation|dl [options] <method> DSM Download Station API'
    console.log '    $ syno audiostation|as [options] <method> DSM Audio Station API'
    console.log '    $ syno videostation|vs [options] <method> DSM Video Station API'
    console.log '    $ syno videostationdtv|dtv [options] <method> DSM Video Station DTV API'
    console.log '    $ syno surveillancestation|ss [options] <method> DSM Surveillance Station API'
    console.log ''
    process.exit 1

# Load cmd line args and environment vars
nconf.argv().file
    file: ospath.home() + "/#{CONFIG_DIR}/#{CONFIG_FILE}"
    format:
        stringify: (obj, options) ->
            yaml.safeDump obj, options
        parse: (obj, options) ->
            yaml.safeLoad obj, options

if program.url
    console.log '[DEBUG] : Params URL detected : %s.', program.url if program.debug

    url_resolved = url.parse program.url
    url_resolved = url.parse DEFAULT_PROTOCOL + '://' + program.url if not url_resolved.protocol
    url_resolved.protocol = url_resolved.protocol.slice(0, -1)

    if url_resolved.protocol isnt 'http' and url_resolved.protocol isnt 'https'
        console.log '[ERROR] : Invalid Protocol URL detected : %s.', url_resolved.protocol
        process.exit 1

    nconf.set 'url:protocol', url_resolved.protocol
    nconf.set 'url:host', url_resolved.hostname or DEFAULT_HOST
    nconf.set 'url:port', url_resolved.port or DEFAULT_PORT
    nconf.set 'url:account', if url_resolved.auth then url_resolved.auth.split(':')[0] else DEFAULT_ACCOUNT
    nconf.set 'url:passwd', if url_resolved.auth then url_resolved.auth.split(':')[1] else DEFAULT_PASSWD
    nconf.set 'url:apiVersion', main.api or DEFAULT_API_VERSION

else if program.config
    console.log '[DEBUG] : Load config file : %s', program.config if program.debug

    try
        fs.accessSync program.config
    catch
        console.log '[ERROR] : Config file : %s not found', program.config
        process.exit 1

      nconf.file
          file: program.config
          format:
              stringify: (obj, options) ->
                  yaml.safeDump obj, options
              parse: (obj, options) ->
                  yaml.safeLoad obj, options
      nconf.overrides
          url:
              apiVersion: main.api or DEFAULT_API_VERSION
else

    # If no directory -> create directory and save the file
    try
        fs.accessSync ospath.home() + "/#{CONFIG_DIR}"
    catch
        console.log '[DEBUG] : Default configuration directory does not exist : %s. Creating...',
            ospath.home() + "/#{CONFIG_DIR}" if program.debug
        fs.mkdirSync ospath.home() + "/#{CONFIG_DIR}"

    try
        fs.accessSync ospath.home() + "/#{CONFIG_DIR}/#{CONFIG_FILE}"
    catch
        console.log '[DEBUG] : Default configuration file does not exist : %s. Creating...',
            ospath.home() + "/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
        nconf.set 'url:protocol', DEFAULT_PROTOCOL
        nconf.set 'url:host', DEFAULT_HOST
        nconf.set 'url:port', DEFAULT_PORT
        nconf.set 'url:account', DEFAULT_ACCOUNT
        nconf.set 'url:passwd', DEFAULT_PASSWD
        nconf.set 'url:apiVersion', DEFAULT_API_VERSION
        nconf.save()

nconf.overrides
    url:
        apiVersion: (nconf.get 'url:apiVersion') or main.api or DEFAULT_API_VERSION

nconf.defaults
    url:
        protocol: DEFAULT_PROTOCOL
        host: DEFAULT_HOST
        port: DEFAULT_PORT
        account: DEFAULT_ACCOUNT
        passwd: DEFAULT_PASSWD
        apiVersion: DEFAULT_API_VERSION

if program.debug
    console.log '[DEBUG] : DSM Connection URL configured : %s://%s:%s@%s:%s',
        nconf.get('url:protocol'), nconf.get('url:account'), nconf.get('url:passwd'), nconf.get('url:host'),
        nconf.get('url:port')

syno = new Syno
    protocol: process.env.SYNO_PROTOCOL or nconf.get 'url:protocol'
    host: process.env.SYNO_HOST or nconf.get 'url:host'
    port: process.env.SYNO_PORT or nconf.get 'url:port'
    account: process.env.SYNO_ACCOUNT or nconf.get 'url:account'
    passwd: process.env.SYNO_PASSWORD or nconf.get 'url:passwd'
    apiVersion: process.env.SYNO_API_VERSION or nconf.get 'url:apiVersion'
    debug: process.env.SYNO_DEBUG or main.debug
    ignoreCertificateErrors: process.env.SYNO_IGNORE_CERTIFICATE_ERRORS or main.ignoreCertificateErrors

program
.command 'diskstationmanager <method>'
.alias 'dsm'
.description 'DSM API'
.option '-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-u, --url <url>',
    "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}"
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno diskstationmanager|dsm startFindme'
    console.log '    $ syno diskstationmanager|dsm getInfo --pretty\''
    console.log '    $ syno diskstationmanagercore|dsm listUsers'
    console.log '    $ syno diskstationmanagercore|dsm listPackages'
    console.log ''
    show_methods_available 'dsm'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM API command selected' if program.debug
    execute 'dsm', cmd, options

program
.command 'filestation <method>'
.alias 'fs'
.description 'DSM File Station API'
.option '-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-u, --url <url>',
    "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}"
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno filestation|fs listSharings'
    console.log '    $ syno filestation|fs list --pretty --payload \'{"folder_path":"/path/to/folder"}\''
    console.log ''
    show_methods_available 'fs'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM File Station API command selected' if program.debug
    execute 'fs', cmd, options

program
.command 'downloadstation <method>'
.alias 'dl'
.description 'DSM Download Station API'
.option '-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-u, --url <url>',
    "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}"
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno downloadstation|dl createTask --payload \'{"uri":"magnet|ed2k|ftp(s)|http(s)://link"}\''
    console.log '    $ syno downloadstation|dl listTasks'
    console.log '    $ syno downloadstation|dl listTasks --payload \'{"limit":1}\''
    console.log '    $ syno downloadstation|dl getInfoTask --pretty --payload \'{"id":"task_id"}\''
    console.log ''
    show_methods_available 'dl'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM Download Station API command selected' if program.debug
    execute 'dl', cmd, options

program
.command('audiostation <method>')
.alias('as')
.description('DSM Audio Station API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>'
    , "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option('-p, --payload <payload>', 'JSON Payload')
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno audiostation|as listSongs --payload \'{"limit":1}\''
    console.log '    $ syno audiostation|as listAlbums'
    console.log '    $ syno audiostation|as searchSong --payload \'{"title":"victoria"}\''
    console.log ''
    show_methods_available 'as'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM Audio Station API command selected' if program.debug
    execute 'as', cmd, options

program
.command('videostation <method>')
.alias('vs')
.description('DSM Video Station API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>'
    , "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option('-p, --payload <payload>', 'JSON Payload')
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno videostation|vs listMovies --payload \'{"limit":1}\''
    console.log '    $ syno videostation|vs getInfoTvShow --payload \'{"id":"episode_id"}\''
    console.log ''
    show_methods_available 'vs'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM Video Station API command selected' if program.debug
    execute 'vs', cmd, options

program
.command('videostationdtv <method>')
.alias('dtv')
.description('DSM Video Station DTV API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>'
    , "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option('-p, --payload <payload>', 'JSON Payload')
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno videostationdtv|dtv listChannels --payload \'{"limit":1}\''
    console.log '    $ syno videostationdtv|dtv getInfoTuner --payload \'{"id":"tuner_id"}\''
    console.log ''
    show_methods_available 'dtv'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM Video Station DTV API command selected' if program.debug
    execute 'dtv', cmd, options

program
.command('surveillancestation <method>')
.alias('ss')
.description('DSM Surveillance Station API')
.option('-c, --config <path>', "DSM configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}")
.option('-u, --url <url>'
    , "DSM URL. Default to #{DEFAULT_PROTOCOL}://#{DEFAULT_ACCOUNT}:#{DEFAULT_PASSWD}@#{DEFAULT_HOST}:#{DEFAULT_PORT}")
.option('-p, --payload <payload>', 'JSON Payload')
.option('-P, --pretty', 'Prettyprint JSON Output')
.option('-d, --debug', 'Enabling Debugging Output')
.option '-a, --api <version>', "DSM API Version. Default to #{DEFAULT_API_VERSION}"
.option '-i, --ignore-certificate-errors', 'Ignore certificate errors'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ syno surveillancestation|ss listCameras'
    console.log '    $ syno surveillancestation|ss getInfoCamera --payload \'{"cameraIds":4}\''
    console.log '    $ syno surveillancestation|ss zoomPtz --payload \'{"cameraId":4, "control": "in"}\''
    console.log ''
    show_methods_available 'ss'
.action (cmd, options) ->
    console.log '[DEBUG] : DSM Surveillance Station API command selected' if program.debug
    execute 'ss', cmd, options

program.parse process.argv
