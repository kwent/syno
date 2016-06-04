{isFunction, isPlainObject, each, filter, camelCase, startsWith, endsWith, last} = require 'lodash'
pluralize = require('pluralize')

class Utils

    # Camelize a string
    # `str` [String]
    # Input: str = "get_something"
    # Output: str = "getSomething"
    @underscoreToCamelize = (str) ->
        str = str.replace /(\_[a-z])/g, ($1) ->
            $1.toUpperCase().replace '_', ''
        str.substring(0, 1).toLowerCase() + str.slice(1)

    # Trim method name
    # Input: str = "SYNO.Backup.Storage.AmazonCloudDrive"
    # Output: str = "BackupStorageAmazonCloudDrive"
    # `str` [String]
    @trimSyno = (str) ->
        str = str.replace /SYNO\./, ''
        str.replace /\./g, ($1) ->
            $1.replace '.', ''

    # Trim syno name
    # Input: str = "SYNO.Backup.Storage.AmazonCloudDrive"
    # Output: str = "Backup"
    # `str` [String]
    @trimSynoNamespace = (str) ->
        str.split('.')[1]

    # Fix CamelCase
    # Input: str = "getconfigchannel"
    # Output: str = "getConfigchannel"
    # `str` [String]
    # `replacement` [String]
    # `pattern` [String]
    @fixCamelCase = (str) ->
        words = ['ack', 'add', 'apply', 'archive', 'arrange', 'audio', 'auth',
        'bat', 'break', 'cam', 'card', 'category', 'check', 'chk', 'clear',
        'close', 'compare', 'config', 'control', 'copy', 'count', 'create',
        'delete', 'del', 'disabled', 'disable', 'door', 'download', 'edit',
        'eject', 'enable', 'enabled', 'enum', 'event', 'export', 'force',
        'format', 'get', 'go', 'holder', 'imported', 'import', 'info', 'io',
        'keep', 'list', 'live', 'load', 'unlock', 'lock', 'log', 'mark', 'md',
        'migration', 'modify', 'module', 'monitor', 'motion', 'notify', 'ntp',
        'open', 'unpair', 'pair', 'play', 'poll', 'polling', 'query', 'quick',
        'record', 'rec', 'recount', 'redirect', 'remove', 'resync', 'retrieve', 'roi',
        'run', 'save', 'search', 'selected', 'select', 'send', 'server', 'set',
        'setting', 'share', 'snapshot', 'start', 'stop', 'stream', 'sync',
        'test', 'trigger', 'updated', 'update', 'upload',
        'verify', 'view', 'volume']

        for word, idx in words
            str = str.replace RegExp("#{word}.", 'i'), ($1) ->
                match = $1.slice(0, -1).toLowerCase()
                if not (words.slice(0, idx).some (el) -> el.indexOf(match) >= 0)
                    $1.charAt(0).toUpperCase() +
                    $1.slice(1, -1) +
                    $1.charAt($1.length - 1).toUpperCase()
                else
                    $1
        return str

    # Remove duplicated occurences
    # Input: str = "listFileStationSnapshot"
    # Output: str = "listSnapshot"
    # `str` [String]
    # `pattern` [String]
    @deletePattern = (str, pattern) ->
        regex = new RegExp(pattern, 'i')
        str = str.replace(regex, '')

    # Pluralize apiSubNname if method is list
    # Input: str = "listSearch"
    # Output: str = "listSearches"
    # `str` [String]
    @listPluralize = (method, apiSubNname) ->
        if startsWith(method.toLowerCase(), 'list') and not endsWith(apiSubNname, 's')
            lastWord = last(apiSubNname.split(/(?=[A-Z][^A-Z]+$)/))
            apiSubNname = pluralize(lastWord) # pluralize if list
        return apiSubNname
        
    @createFunctionName = (apiName, method) ->
        nameSpace    = Utils.trimSynoNamespace(apiName)
        apiName      = Utils.trimSyno(apiName)
        apiName      = Utils.deletePattern(apiName, nameSpace)
        apiName      = Utils.deletePattern(apiName, method)
        method       = Utils.deletePattern(method, apiName)
        method       = Utils.fixCamelCase(method) # getinfo to getInfo
        apiName      = Utils.listPluralize(method, apiName) # if list -> apiName plural
        functionName = "#{method}#{apiName}"
        functionName = camelCase(functionName)
    
    # Processes optional parameters and done callback
    # `options`         [Object]
    # `options.params`  [Object]    Parameters object.
    # `options.done`    [Function]  Done callback.
    @optionalParamsAndDone: (options = {})->
        # Get params and done varaibles from options
        {params, done} = options

        # If the done function is not defined, then use the params if it is a function, or use the no operation function
        if not done
            options.done = if isFunction params then params else ->

        # If params is not a plain object, use an empty one
        if not isPlainObject params then options.params = {}

        # Return processed options
        return options