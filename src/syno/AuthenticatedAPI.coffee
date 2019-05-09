# Library for receiving otp_code from google auth
{authenticator} = require('otplib')
# Authenticated API
# API that logs in before calling real request
class AuthenticatedAPI extends API

    # Private noop function
    noop = ->

    # Overrides request : login before calling real request
    request: (options, done = noop)->
        # If session property is set, call real request
        if @syno.sessions and @syno.sessions[options.sessionName] and @syno.sessions[options.sessionName]['_sid']
            options.params['_sid'] = @syno.sessions[options.sessionName]['_sid']
            super options, done
        # Else login then call real request
        else
            opt_code = if @syno.otp then authenticator.generate(@syno.otp) else undefined
            @syno.auth.login { sessionName: options.sessionName, otp_code: opt_code }, (error, response)=>
                if error
                    done error
                else
                    @syno.sessions[options.sessionName] = { _sid: response['sid'] }
                    options.params['_sid'] = response['sid']
                    super options, done
