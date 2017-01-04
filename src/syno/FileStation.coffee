class FileStation extends AuthenticatedAPI

    constructor: (@syno)->
        super(@syno)
        @syno.session = 'FileStation'
        @syno.createFunctionsFor(this, ['SYNO.FileStation'])

    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered

    # Handle FileStation API errors
    error: (code, api)->
        # Favorite API specific errors
        if api is 'SYNO.FileStation.Favorite'
            switch code
                when 800 then return 'A folder path of favorite folder is already added to user\'s favorites.'
                when 801
                    return 'A name of favorite folder conflicts with an existing folder path in the user\'s favorites.'
                when 802 then return 'There are too many favorites to be added.'
        # Upload API specific errors
        if api is 'SYNO.FileStation.Upload'
            switch code
                when 1800
                    return 'There is no Content-Length information in the HTTP header or the received size doesn\'t
                        match the value of Content-Length information in the HTTP header.'
                when 1801
                    return 'Wait too long, no date can be received from client (Default maximum wait time is 3600
                        seconds).'
                when 1802 then return 'No filename information in the last part of file content.'
                when 1803 then return 'Upload connection is cancelled.'
                when 1804 then return 'Failed to upload too big file to FAT file system.'
                when 1805 then return 'Can\'t overwrite or skip the existed file, if no overwrite parameter is given.'
        # Sharing API specfic errors
        if api is 'SYNO.FileStation.Sharing'
            switch code
                when 2000 then return 'Sharing link does not exist.'
                when 2001 then return 'Cannot generate sharing link because too many sharing links exist.'
                when 2002 then return 'Failed to access sharing links.'
        # CreateFolder API specific errors
        if api is 'SYNO.FileStation.CreateFolder'
            switch code
                when 1100  then return 'Failed to create a folder. More information in <errors> object.'
                when 1101  then return 'The number of folders to the parent folder would exceed the system limitation.'
        # Rename API specific errors
        if api is 'SYNO.FileStation.Rename'
            switch code
                when 1200 then return 'Failed to rename it. More information in <errors> object.'
        # CopyMove API specific errors
        if api is 'SYNO.FileStation.CopyMove'
            switch code
                when 1000 then return 'Failed to copy files/folders. More information in <errors> object.'
                when 1001 then return 'Failed to move files/folders. More information in <errors> object.'
                when 1002 then return 'An error occurred at the destination. More information in <errors> object.'
                when 1003
                    return 'Cannot overwrite or skip the existing file because no overwrite parameter is given.'
                when 1004
                    return 'File cannot overwrite a folder with the same name, or folder cannot overwrite a file with
                            the same name.'
                when 1006 then return 'Cannot copy/move file/folder with special characters to a FAT32 file system.'
                when 1007 then return 'Cannot copy/move a file bigger than 4G to a FAT32 file system.'
        # Delete API specific errors
        if api is 'SYNO.FileStation.Delete'
            switch code
                when 900 then return 'Failed to delete file(s)/folder(s). More information in <errors> object.'
        # Extract APi specific errors
        if api is 'SYNO.FileStation.Extract'
            switch code
                when 1400 then return 'Failed to extract files.'
                when 1401 then return 'Cannot open the file as archive.'
                when 1402 then return 'Failed to read archive data error'
                when 1403 then return 'Wrong password.'
                when 1404 then return 'Failed to get the file and dir list in an archive.'
                when 1405 then return 'Failed to find the item ID in an archive file.'
        # Compress API specific errors
        if api is 'SYNO.FileStation.Compress'
            switch code
                when 1300 then return 'Failed to compress files/folders.'
                when 1301 then return 'Cannot create the archive because the given archive name is too long.'
        # FileStation specific errors
        switch code
            when 400 then return 'Invalid parameter of file operation'
            when 401 then return 'Unknown error of file operation'
            when 402 then return 'System is too busy'
            when 403 then return 'Invalid user does this file operation'
            when 404 then return 'Invalid group does this file operation'
            when 405 then return 'Invalid user and group does this file operation'
            when 406 then return 'Can\'t get user/group information from the account server'
            when 407 then return 'Operation not permitted'
            when 408 then return 'No such file or directory'
            when 409 then return 'Non-supported file system'
            when 410 then return 'Failed to connect internet-based file system (ex: CIFS)'
            when 411 then return 'Read-only file system'
            when 412 then return 'Filename too long in the non-encrypted file system'
            when 413 then return 'Filename too long in the encrypted file system'
            when 414 then return 'File already exists'
            when 415 then return 'Disk quota exceeded'
            when 416 then return 'No space left on device'
            when 417 then return 'Input/output error'
            when 418 then return 'Illegal name or path'
            when 419 then return 'Illegal file name'
            when 420 then return 'Illegal file name on FAT file system'
            when 421 then return 'Device or resource busy'
            when 599 then return 'No such task of the file operation'
        # No specific error found, so call super function
        return super