API = mod syno.API

# Authenticated API
# API that logs in before calling real request
class AuthenticatedAPI extends API

    # Private noop function
    noop = ->

    # Overrides request : login before calling real request
    request: (options, done = noop)->
        # If session property is set, call real request
        if @syno.session then super options, done
        # Else login then call real request
        else @syno.auth.login (error)=> if error then done error else super options, done