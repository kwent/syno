class AudioStation extends AuthenticatedAPI

    # SYNO.AudioStation.Info (AudioStation/info.cgi)
    
    getAudioStationInfo: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Info'
                version: 1
                path: 'AudioStation/info.cgi'
                method: 'getinfo'
        }

    # SYNO.AudioStation.Album (AudioStation/album.cgi)
    
    listAlbums: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Album'
                version: 1
                path: 'AudioStation/album.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Composer (AudioStation/composer.cgi)
    
    listComposers: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Composer'
                version: 1
                path: 'AudioStation/composer.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Genre (AudioStation/genre.cgi)
    
    listGenres: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Genre'
                version: 1
                path: 'AudioStation/genre.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Artist (AudioStation/artist.cgi)
    
    listArtists: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Artist'
                version: 1
                path: 'AudioStation/artist.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Folder (AudioStation/folder.cgi)
    
    listFolders: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Folder'
                version: 1
                path: 'AudioStation/folder.cgi'
                method: 'list'
        }
        
    getFolderInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.AudioStation.Folder'
                version: 1
                path: 'AudioStation/folder.cgi'
                method: 'getinfo'
        }
    
    # SYNO.AudioStation.Song (AudioStation/song.cgi)
    
    listSongs: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Song'
                version: 1
                path: 'AudioStation/song.cgi'
                method: 'list'
        }
        
    getSongInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.AudioStation.Song'
                version: 1
                path: 'AudioStation/song.cgi'
                method: 'getinfo'
        }

    searchSong: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Song'
                version: 1
                path: 'AudioStation/song.cgi'
                method: 'search'
        }
        
    # SYNO.AudioStation.Radio (AudioStation/radio.cgi)
    # TODO
    # add
    # updateradios
        
    listRadios: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Radio'
                version: 1
                path: 'AudioStation/radio.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Playlist (AudioStation/playlist.cgi)
    # TODO
    # create
    # delete
    # rename
    # copytolibrary
    # updatesongs
    # createsmart
    # updatesmart
    
    listPlaylists: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.Playlist'
                version: 1
                path: 'AudioStation/playlist.cgi'
                method: 'list'
        }

    getPlaylistInfo: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                api: 'SYNO.AudioStation.Playlist'
                version: 1
                path: 'AudioStation/playlist.cgi'
                method: 'getinfo'
        }
        
    # SYNO.AudioStation.RemotePlayer (AudioStation/remote_player.cgi)
    # TODO
    # getstatus
    # getplaylist
    # updateplaylist
    # control
    # testpassword
    # setpassword
    
    listRemotePlayers: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.RemotePlayer'
                version: 1
                path: 'AudioStation/remote_player.cgi'
                method: 'list'
        }

    # SYNO.AudioStation.Proxy (AudioStation/proxy.cgi)
    # TODO
    # getstreamid
    # stream
    # getsonginfo
    # deletesonginfo
    
    # SYNO.AudioStation.Lyrics (AudioStation/lyrics.cgi)
    # TODO
    # getLyrics
    # setlyrics
        
    # SYNO.AudioStation.LyricsSearch (AudioStation/lyrics_search.cgi)
    
    searchLyrics: (params, done)->
        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                api: 'SYNO.AudioStation.LyricsSearch'
                version: 1
                path: 'AudioStation/lyrics_search.cgi'
                method: 'searchlyrics'
        }

    # SYNO.AudioStation.MediaServer (AudioStation/media_server.cgi)
    
    listMediaServers: (params, done)->
        @requestAPI {
            params, done
            apiInfos:
                api: 'SYNO.AudioStation.MediaServer'
                version: 1
                path: 'AudioStation/media_server.cgi'
                method: 'list'
        }
        
    # SYNO.AudioStation.Cover (AudioStation/cover.cgi)
    # TODO
    # getsongcover
    # getfoldercover
    # getcover
    
    # SYNO.AudioStation.Stream (AudioStation/stream.cgi)
    # TODO
    # stream
    # transcode
    
    getMethods: (params, done)->
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered