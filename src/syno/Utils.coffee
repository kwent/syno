{isFunction, isPlainObject, each, filter} = require 'lodash'

class Utils
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

    # Check if required parameters are present in `params`
    # If a required param is not present, raise an Error
    @checkRequiredParams: (params, required = [])->
        # Return missing params
        filter required, (key)-> params[key]