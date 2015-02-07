path = require 'path'

moduleName = (filepath, options)->
    # Get filepath relative to current working directory
    filepath = path.relative options.cwd, filepath
    # Get index of the extension
    extensionIndex = filepath.lastIndexOf '.'
    # Remove extension
    filepath = filepath.slice 0, extensionIndex
    # Split the filepath using path separator
    filepath = filepath.split '/'
    # Get the basename of the file by getting the last item
    basename = filepath[filepath.length-1]
    # Join filepath using dot separator
    name = filepath.join '.'
    return {name, basename}


module.exports = ()->
    # Common options
    # Indent using four spaces
    options: indent: '    '

    # Wrap eseo modules with define pattern
    syno:
        cwd: 'src/syno'
        src: '**/*.coffee'
        expand: yes
        dest: 'tmp/wrap/syno'
        options:
            wrapper: (filepath)->
                {name, basename} = moduleName filepath,  cwd: 'src/syno'
                return [
                    # Header : define module
                    "mod syno.#{name}, ->"
                    # Footer : return value
                    "    return #{basename}"
                ]