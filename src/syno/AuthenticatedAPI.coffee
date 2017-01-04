# Authenticated API
# API that logs in before calling real request
class AuthenticatedAPI extends API

    # Private noop function
    noop = ->

    # Overrides request : login before calling real request
    request: (options, done = noop)->
        # If session property is set, call real request
        if @syno.sessions and @syno.sessions[options.sessionName] and @syno.sessions[options.sessionName]['_sid']
            super options, done
        # Else login then call real request
        else @syno.auth.login options.sessionName, (error, response)=>
            if error
                done error
            else
                @syno.sessions[options.sessionName] = response['sid']
                options.params['_sid'] = response['sid']
                super options, done