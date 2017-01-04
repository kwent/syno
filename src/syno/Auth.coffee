# Auth API
class Auth extends API

    # API name
    api = 'SYNO.API.Auth'
    # API version
    version = 3
    # API path
    path = 'auth.cgi'

    # Login to Syno
    # `done` [Function] Callback called when the login processed is complete
    login: (done)->
        # API method is `login`
        method = 'login'
        # Use a unique session
        params =
            account: @syno.account
            passwd: @syno.passwd
            session: @syno.session
        # Set logged to false
        @syno.logged = false

        # Request login
        @request {api, version, path, method, params}, done

    # Logout to syno
    # `done` [Function] Callback called when the logout process is complete
    logout: (done)->
        # Don't do anything if there is no session
        if not @syno.session then return null
        # API method is `logout`
        method = 'logout'
        # Init logout parameters
        params = session: @syno.session

        # Remove session property of syno
        @syno.session = null

        # Request logout
        @request {api, version, path, method, params}, done

    # Handle auth specific errors
    error: (code)->
        switch code
            when 400 then return 'No such account or incorrect password'
            when 401 then return 'Account disabled'
            when 402 then return 'Permission denied'
            when 403 then return '2-step verification code required'
            when 404 then return 'Failed to authenticate 2-step verification code'
        # No specific error, so call super function
        return super