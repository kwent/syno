(function(){
    var modules = {};
    function setter(){ throw new Error('Cannot manually set module property'); }
    function setModule(name, factory){
        if(modules.hasOwnProperty(name)){
            throw new Error('Module '+name+' already exists.');
        }
        var module;
        Object.defineProperty(modules, name, {
            get: function(){
                if(module) {
                    return module;
                }
                if(factory.busy) {
                    throw new Error('Cyclic dependency detected on module '+name);
                }
                factory.busy = true;
                module = factory();
                factory.busy = false;
                return module;
            },
            set: setter
        });
    }
    with(modules){
        (function() {
          var extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;
        
          setModule('API', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var API, defaults, extend, isEmpty, mapValues, ref;
              ref = require('lodash'), extend = ref.extend, defaults = ref.defaults, isEmpty = ref.isEmpty, mapValues = ref.mapValues;
              API = (function() {
                var noop;
        
                noop = function() {};
        
                function API(syno1) {
                  this.syno = syno1;
                }
        
                API.prototype.request = function(options, done) {
                  var api, host, method, params, path, port, protocol, qs, ref1, url, version;
                  if (options == null) {
                    options = {};
                  }
                  if (done == null) {
                    done = noop;
                  }
                  ref1 = this.syno, protocol = ref1.protocol, host = ref1.host, port = ref1.port;
                  api = options.api, version = options.version, path = options.path, method = options.method, params = options.params;
                  url = protocol + "://" + host + ":" + port + "/webapi/" + path;
                  qs = defaults({
                    api: api,
                    version: version,
                    method: method
                  }, params);
                  return this.syno.request({
                    url: url,
                    qs: qs
                  }, (function(_this) {
                    return function(error, response, body) {
                      var code;
                      if (error) {
                        return done(error);
                      }
                      if (response.statusCode !== 200) {
                        error = new Error("HTTP status code: " + response.statusCode);
                        error.response = response;
                        return done(error);
                      }
                      if (!body.success || (body.success && body.data && body.data instanceof Array && body.data[0] && body.data[0].error)) {
                        code = body.error ? body.error.code : body.data[0].error;
                        error = new Error(_this.error(code, api));
                        error.code = code;
                        if (body.error && body.error.errors) {
                          error.errors = body.error.errors;
                        }
                        return done(error);
                      }
                      return done(null, body.data);
                    };
                  })(this));
                };
        
                API.prototype.requestAPI = function(args) {
                  var apiInfos, done, missing, opts, params, ref1, requiredParams;
                  apiInfos = args.apiInfos, requiredParams = args.requiredParams, params = args.params, done = args.done;
                  ref1 = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = ref1.params, done = ref1.done;
                  params = mapValues(params, function(param) {
                    return param && param.toString();
                  });
                  missing = Utils.checkRequiredParams(params, requiredParams);
                  if (!isEmpty(missing)) {
                    return done(new Error("Missing required params: " + (missing.join(', '))));
                  }
                  opts = extend({}, apiInfos, {
                    params: params
                  });
                  return this.request(opts, done);
                };
        
                API.prototype.error = function(code) {
                  switch (code) {
                    case 101:
                      return 'No parameter of API, method or version';
                    case 102:
                      return 'The requested API does not exist';
                    case 103:
                      return 'The requested method does not exist';
                    case 104:
                      return 'The requested version does not support the functionality';
                    case 105:
                      return 'The logged in session does not have permission';
                    case 106:
                      return 'Session timeout';
                    case 107:
                      return 'Session interrupted by duplicate login';
                    default:
                      return 'Unknown error';
                  }
                };
        
                return API;
        
              })();
              return module.exports = API;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('AudioStation', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var AudioStation;
              AudioStation = (function(superClass) {
                extend1(AudioStation, superClass);
        
                function AudioStation() {
                  return AudioStation.__super__.constructor.apply(this, arguments);
                }
        
                AudioStation.prototype.getAudioStationInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Info',
                      version: 1,
                      path: 'AudioStation/info.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                AudioStation.prototype.listAlbums = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Album',
                      version: 1,
                      path: 'AudioStation/album.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.listComposers = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Composer',
                      version: 1,
                      path: 'AudioStation/composer.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.listGenres = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Genre',
                      version: 1,
                      path: 'AudioStation/genre.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.listArtists = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Artist',
                      version: 1,
                      path: 'AudioStation/artist.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.listFolders = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Folder',
                      version: 1,
                      path: 'AudioStation/folder.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.getFolderInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.AudioStation.Folder',
                      version: 1,
                      path: 'AudioStation/folder.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                AudioStation.prototype.listSongs = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Song',
                      version: 1,
                      path: 'AudioStation/song.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.getSongInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.AudioStation.Song',
                      version: 1,
                      path: 'AudioStation/song.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                AudioStation.prototype.searchSong = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Song',
                      version: 1,
                      path: 'AudioStation/song.cgi',
                      method: 'search'
                    }
                  });
                };
        
                AudioStation.prototype.listRadios = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Radio',
                      version: 1,
                      path: 'AudioStation/radio.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.listPlaylists = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.Playlist',
                      version: 1,
                      path: 'AudioStation/playlist.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.getPlaylistInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.AudioStation.Playlist',
                      version: 1,
                      path: 'AudioStation/playlist.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                AudioStation.prototype.listRemotePlayers = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.RemotePlayer',
                      version: 1,
                      path: 'AudioStation/remote_player.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.searchLyrics = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.AudioStation.LyricsSearch',
                      version: 1,
                      path: 'AudioStation/lyrics_search.cgi',
                      method: 'searchlyrics'
                    }
                  });
                };
        
                AudioStation.prototype.listMediaServers = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.AudioStation.MediaServer',
                      version: 1,
                      path: 'AudioStation/media_server.cgi',
                      method: 'list'
                    }
                  });
                };
        
                AudioStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return AudioStation;
        
              })(AuthenticatedAPI);
              return module.exports = AudioStation;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Auth', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Auth;
              Auth = (function(superClass) {
                var api, path, version;
        
                extend1(Auth, superClass);
        
                function Auth() {
                  return Auth.__super__.constructor.apply(this, arguments);
                }
        
                api = 'SYNO.API.Auth';
        
                version = 3;
        
                path = 'auth.cgi';
        
                Auth.prototype.login = function(done) {
                  var method, params, session;
                  method = 'login';
                  session = 'SYNO_SESSION_' + Date.now();
                  params = {
                    account: this.syno.account,
                    passwd: this.syno.passwd,
                    session: session
                  };
                  this.syno.session = session;
                  return this.request({
                    api: api,
                    version: version,
                    path: path,
                    method: method,
                    params: params
                  }, done);
                };
        
                Auth.prototype.logout = function(done) {
                  var method, params;
                  if (!this.syno.session) {
                    return null;
                  }
                  method = 'logout';
                  params = {
                    session: this.syno.session
                  };
                  this.syno.session = null;
                  return this.request({
                    api: api,
                    version: version,
                    path: path,
                    method: method,
                    params: params
                  }, done);
                };
        
                Auth.prototype.error = function(code) {
                  switch (code) {
                    case 400:
                      return 'No such account or incorrect password';
                    case 401:
                      return 'Account disabled';
                    case 402:
                      return 'Permission denied';
                    case 403:
                      return '2-step verification code required';
                    case 404:
                      return 'Failed to authenticate 2-step verification code';
                  }
                  return Auth.__super__.error.apply(this, arguments);
                };
        
                return Auth;
        
              })(API);
              return module.exports = Auth;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('AuthenticatedAPI', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var AuthenticatedAPI;
              AuthenticatedAPI = (function(superClass) {
                var noop;
        
                extend1(AuthenticatedAPI, superClass);
        
                function AuthenticatedAPI() {
                  return AuthenticatedAPI.__super__.constructor.apply(this, arguments);
                }
        
                noop = function() {};
        
                AuthenticatedAPI.prototype.request = function(options, done) {
                  if (done == null) {
                    done = noop;
                  }
                  if (this.syno.session) {
                    return AuthenticatedAPI.__super__.request.call(this, options, done);
                  } else {
                    return this.syno.auth.login((function(_this) {
                      return function(error) {
                        if (error) {
                          return done(error);
                        } else {
                          return AuthenticatedAPI.__super__.request.call(_this, options, done);
                        }
                      };
                    })(this));
                  }
                };
        
                return AuthenticatedAPI;
        
              })(API);
              return module.exports = AuthenticatedAPI;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('DownloadStation', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var DownloadStation;
              DownloadStation = (function(superClass) {
                extend1(DownloadStation, superClass);
        
                function DownloadStation() {
                  return DownloadStation.__super__.constructor.apply(this, arguments);
                }
        
                DownloadStation.prototype.getDownloadStationInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Info',
                      version: 1,
                      path: 'DownloadStation/info.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                DownloadStation.prototype.getDownloadStationConfig = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Info',
                      version: 1,
                      path: 'DownloadStation/info.cgi',
                      method: 'getconfig'
                    }
                  });
                };
        
                DownloadStation.prototype.setDownloadStationConfig = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Info',
                      version: 1,
                      path: 'DownloadStation/info.cgi',
                      method: 'setserverconfig'
                    }
                  });
                };
        
                DownloadStation.prototype.getScheduleConfig = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Schedule',
                      version: 1,
                      path: 'DownloadStation/schedule.cgi',
                      method: 'getconfig'
                    }
                  });
                };
        
                DownloadStation.prototype.setScheduleConfig = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Schedule',
                      version: 1,
                      path: 'DownloadStation/schedule.cgi',
                      method: 'setconfig'
                    }
                  });
                };
        
                DownloadStation.prototype.listTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 1,
                      path: 'DownloadStation/task.cgi',
                      method: 'list'
                    }
                  });
                };
        
                DownloadStation.prototype.getTasksInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 1,
                      path: 'DownloadStation/task.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                DownloadStation.prototype.createTask = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 3,
                      path: 'DownloadStation/task.cgi',
                      method: 'create'
                    }
                  });
                };
        
                DownloadStation.prototype.deleteTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 1,
                      path: 'DownloadStation/task.cgi',
                      method: 'delete'
                    }
                  });
                };
        
                DownloadStation.prototype.pauseTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 1,
                      path: 'DownloadStation/task.cgi',
                      method: 'pause'
                    }
                  });
                };
        
                DownloadStation.prototype.resumeTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 1,
                      path: 'DownloadStation/task.cgi',
                      method: 'resume'
                    }
                  });
                };
        
                DownloadStation.prototype.editTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Task',
                      version: 2,
                      path: 'DownloadStation/task.cgi',
                      method: 'edit'
                    }
                  });
                };
        
                DownloadStation.prototype.getStats = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.Statistic',
                      version: 1,
                      path: 'DownloadStation/statistic.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                DownloadStation.prototype.listRSSSites = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.RSS.Site',
                      version: 1,
                      path: 'DownloadStation/RSSsite.cgi',
                      method: 'list'
                    }
                  });
                };
        
                DownloadStation.prototype.refreshRSSSites = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.RSS.Site',
                      version: 1,
                      path: 'DownloadStation/RSSsite.cgi',
                      method: 'refresh'
                    }
                  });
                };
        
                DownloadStation.prototype.listRSSFeeds = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.RSS.Feed',
                      version: 1,
                      path: 'DownloadStation/RSSfeed.cgi',
                      method: 'list'
                    }
                  });
                };
        
                DownloadStation.prototype.startBTSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['keyword', 'module'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.BTSearch',
                      version: 1,
                      path: 'DownloadStation/btsearch.cgi',
                      method: 'start'
                    }
                  });
                };
        
                DownloadStation.prototype.listBTSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.BTSearch',
                      version: 1,
                      path: 'DownloadStation/btsearch.cgi',
                      method: 'start'
                    }
                  });
                };
        
                DownloadStation.prototype.getBTSearchCategories = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.BTSearch',
                      version: 1,
                      path: 'DownloadStation/btsearch.cgi',
                      method: 'getCategory'
                    }
                  });
                };
        
                DownloadStation.prototype.cleanBTSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.DownloadStation.BTSearch',
                      version: 1,
                      path: 'DownloadStation/btsearch.cgi',
                      method: 'clean'
                    }
                  });
                };
        
                DownloadStation.prototype.getBTSearchModules = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DownloadStation.BTSearch',
                      version: 1,
                      path: 'DownloadStation/btsearch.cgi',
                      method: 'getModule'
                    }
                  });
                };
        
                DownloadStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                DownloadStation.prototype.error = function(code, api) {
                  if (api === 'SYNO.DownloadStation.Task') {
                    switch (code) {
                      case 400:
                        return 'File upload failed';
                      case 401:
                        return 'Max number of tasks reached';
                      case 402:
                        return 'Destination denied';
                      case 403:
                        return 'Destination does not exist';
                      case 404:
                        return 'Invalid task id';
                      case 405:
                        return 'Invalid task action';
                      case 406:
                        return 'No default destination';
                      case 407:
                        return 'Set destination failed';
                      case 408:
                        return 'File does not exist';
                    }
                  }
                  if (api === 'SYNO.DownloadStation.BTSearch') {
                    switch (code) {
                      case 400:
                        return 'Unknown error';
                      case 401:
                        return 'Invalid parameter';
                      case 402:
                        return 'Parse the user setting failed';
                      case 403:
                        return 'Get category failed';
                      case 404:
                        return 'Get the search result from DB failed';
                      case 405:
                        return 'Get the user setting failed';
                    }
                  }
                  return DownloadStation.__super__.error.apply(this, arguments);
                };
        
                return DownloadStation;
        
              })(AuthenticatedAPI);
              return module.exports = DownloadStation;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('FileStation', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var FileStation, defaults;
              defaults = require('lodash').defaults;
              FileStation = (function(superClass) {
                var download, upload;
        
                extend1(FileStation, superClass);
        
                function FileStation() {
                  return FileStation.__super__.constructor.apply(this, arguments);
                }
        
                FileStation.prototype.getFileStationInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.Info',
                      version: 1,
                      path: 'FileStation/info.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                FileStation.prototype.listSharedFolders = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.List',
                      version: 1,
                      path: 'FileStation/file_share.cgi',
                      method: 'list_share'
                    }
                  });
                };
        
                FileStation.prototype.listFiles = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.List',
                      version: 1,
                      path: 'FileStation/file_share.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.getFilesInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.List',
                      version: 1,
                      path: 'FileStation/file_share.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                FileStation.prototype.startSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Search',
                      version: 1,
                      path: 'FileStation/file_find.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.stopSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Search',
                      version: 1,
                      path: 'FileStation/file_find.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.listSearch = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Search',
                      version: 1,
                      path: 'FileStation/file_find.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.cleanSearches = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Search',
                      version: 1,
                      path: 'FileStation/file_find.cgi',
                      method: 'clean'
                    }
                  });
                };
        
                FileStation.prototype.listVirtualFolders = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['type'],
                    apiInfos: {
                      api: 'SYNO.FileStation.VirtualFolder',
                      version: 1,
                      path: 'FileStation/file_virtual.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.listFavorites = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.addFavorite = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'name'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.deleteFavorite = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'delete'
                    }
                  });
                };
        
                FileStation.prototype.cleanBrokenFavorites = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'delete'
                    }
                  });
                };
        
                FileStation.prototype.editFavorite = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'name'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'edit'
                    }
                  });
                };
        
                FileStation.prototype.replaceAllFavorites = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'name'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Favorite',
                      version: 1,
                      path: 'FileStation/file_favorite.cgi',
                      method: 'replace_all'
                    }
                  });
                };
        
                FileStation.prototype.getThumbnail = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Thumb',
                      version: 1,
                      path: 'FileStation/file_thumb.cgi',
                      method: 'get'
                    }
                  });
                };
        
                FileStation.prototype.startDirSize = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.DirSize',
                      version: 1,
                      path: 'FileStation/file_dirSize.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusDirSize = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.DirSize',
                      version: 1,
                      path: 'FileStation/file_dirSize.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopDirSize = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.DirSize',
                      version: 1,
                      path: 'FileStation/file_dirSize.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.startMD5 = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['file_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.MD5',
                      version: 1,
                      path: 'FileStation/file_md5.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusMD5 = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.MD5',
                      version: 1,
                      path: 'FileStation/file_md5.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopMD5 = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.MD5',
                      version: 1,
                      path: 'FileStation/file_md5.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.checkWritePermission = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.MD5',
                      version: 1,
                      path: 'FileStation/file_md5.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.getSharingLinkInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                FileStation.prototype.listSharingLinks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.createSharingLinks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'create'
                    }
                  });
                };
        
                FileStation.prototype.deleteSharingLinks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'delete'
                    }
                  });
                };
        
                FileStation.prototype.clearInvalidSharingLinks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'clear_invalid'
                    }
                  });
                };
        
                FileStation.prototype.editSharingLinks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Sharing',
                      version: 1,
                      path: 'FileStation/file_sharing.cgi',
                      method: 'edit'
                    }
                  });
                };
        
                FileStation.prototype.createFolder = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_path', 'name'],
                    apiInfos: {
                      api: 'SYNO.FileStation.CreateFolder',
                      version: 1,
                      path: 'FileStation/file_crtfdr.cgi',
                      method: 'create'
                    }
                  });
                };
        
                FileStation.prototype.rename = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'name'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Rename',
                      version: 1,
                      path: 'FileStation/file_rename.cgi',
                      method: 'rename'
                    }
                  });
                };
        
                FileStation.prototype.startCopyMove = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'dest_folder_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.CopyMove',
                      version: 1,
                      path: 'FileStation/file_MVCP.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusCopyMove = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.CopyMove',
                      version: 1,
                      path: 'FileStation/file_MVCP.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopCopyMove = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.CopyMove',
                      version: 1,
                      path: 'FileStation/file_MVCP.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.startDelete = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Delete',
                      version: 1,
                      path: 'FileStation/file_delete.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusDelete = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Delete',
                      version: 1,
                      path: 'FileStation/file_delete.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopDelete = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Delete',
                      version: 1,
                      path: 'FileStation/file_delete.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype["delete"] = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Delete',
                      version: 1,
                      path: 'FileStation/file_delete.cgi',
                      method: 'delete'
                    }
                  });
                };
        
                FileStation.prototype.startExtract = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['file_path', 'dest_folder_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Extract',
                      version: 1,
                      path: 'FileStation/file_extract.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusExtract = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Extract',
                      version: 1,
                      path: 'FileStation/file_extract.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopExtract = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Extract',
                      version: 1,
                      path: 'FileStation/file_extract.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.listArchiveFiles = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['file_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Extract',
                      version: 1,
                      path: 'FileStation/file_extract.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.startCompress = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['path', 'dest_file_path'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Compress',
                      version: 1,
                      path: 'FileStation/file_compress.cgi',
                      method: 'start'
                    }
                  });
                };
        
                FileStation.prototype.statusCompress = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Compress',
                      version: 1,
                      path: 'FileStation/file_compress.cgi',
                      method: 'status'
                    }
                  });
                };
        
                FileStation.prototype.stopCompress = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['taskid'],
                    apiInfos: {
                      api: 'SYNO.FileStation.Compress',
                      version: 1,
                      path: 'FileStation/file_compress.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                FileStation.prototype.listBackgroundTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.BackgroundTask',
                      version: 1,
                      path: 'FileStation/background_task.cgi',
                      method: 'list'
                    }
                  });
                };
        
                FileStation.prototype.clearFinishedBackgroundTasks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.FileStation.BackgroundTask',
                      version: 1,
                      path: 'FileStation/background_task.cgi',
                      method: 'clear_finished'
                    }
                  });
                };
        
                upload = function(syno, params, done) {
                  var api, formData, host, method, path, port, protocol, ref, url, version;
                  ref = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = ref.params, done = ref.done;
                  Utils.checkRequiredParams(params, ['dest_folder_path', 'filename']);
                  protocol = syno.protocol, host = syno.host, port = syno.port;
                  api = 'SYNO.FileStation.Upload';
                  version = '1';
                  path = 'FileStation/api_upload.cgi';
                  method = 'upload';
                  url = protocol + "://" + host + ":" + port + "/webapi/" + path;
                  formData = defaults({
                    api: api,
                    version: version,
                    method: method
                  }, params);
                  return syno.request.post({
                    url: url,
                    formData: formData
                  }, function(error, response, data) {
                    if (error) {
                      return done(error);
                    }
                    if (response.statusCode !== 200) {
                      return done(response.statusCode);
                    }
                    if (!data.success) {
                      return done(data.error);
                    }
                    return done(null);
                  });
                };
        
                FileStation.prototype.upload = function(params, done) {
                  var syno;
                  syno = this.syno;
                  if (syno.session) {
                    return upload(syno, params, done);
                  } else {
                    return syno.auth.login(function(error) {
                      if (error) {
                        return done(error);
                      } else {
                        return upload(syno, params, done);
                      }
                    });
                  }
                };
        
                download = function(syno, params, done) {
                  var api, host, method, path, port, protocol, qs, ref, stream, url, version;
                  ref = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = ref.params, done = ref.done;
                  Utils.checkRequiredParams(params, ['path', 'stream']);
                  stream = params.stream;
                  delete params.stream;
                  protocol = syno.protocol, host = syno.host, port = syno.port;
                  api = 'SYNO.FileStation.Download';
                  version = 1;
                  path = 'FileStation/file_download.cgi';
                  method = 'download';
                  url = protocol + "://" + host + ":" + port + "/webapi/" + path;
                  qs = defaults({
                    api: api,
                    version: version,
                    method: method
                  }, params);
                  return syno.request({
                    url: url,
                    qs: qs,
                    json: false
                  }).on('error', function(error) {
                    return done(error);
                  }).on('end', function() {
                    return done(null);
                  }).pipe(stream);
                };
        
                FileStation.prototype.download = function(params, done) {
                  var syno;
                  syno = this.syno;
                  if (syno.session) {
                    return download(syno, params, done);
                  } else {
                    return syno.auth.login(function(error) {
                      if (error) {
                        return done(error);
                      } else {
                        return download(syno, params, done);
                      }
                    });
                  }
                };
        
                FileStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                FileStation.prototype.error = function(code, api) {
                  if (api === 'SYNO.FileStation.Favorite') {
                    switch (code) {
                      case 800:
                        return 'A folder path of favorite folder is already added to user\'s favorites.';
                      case 801:
                        return 'A name of favorite folder conflicts with an existing folder path in the user\'s favorites.';
                      case 802:
                        return 'There are too many favorites to be added.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Upload') {
                    switch (code) {
                      case 1800:
                        return 'There is no Content-Length information in the HTTP header or the received size doesn\'t match the value of Content-Length information in the HTTP header.';
                      case 1801:
                        return 'Wait too long, no date can be received from client (Default maximum wait time is 3600 seconds).';
                      case 1802:
                        return 'No filename information in the last part of file content.';
                      case 1803:
                        return 'Upload connection is cancelled.';
                      case 1804:
                        return 'Failed to upload too big file to FAT file system.';
                      case 1805:
                        return 'Can\'t overwrite or skip the existed file, if no overwrite parameter is given.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Sharing') {
                    switch (code) {
                      case 2000:
                        return 'Sharing link does not exist.';
                      case 2001:
                        return 'Cannot generate sharing link because too many sharing links exist.';
                      case 2002:
                        return 'Failed to access sharing links.';
                    }
                  }
                  if (api === 'SYNO.FileStation.CreateFolder') {
                    switch (code) {
                      case 1100:
                        return 'Failed to create a folder. More information in <errors> object.';
                      case 1101:
                        return 'The number of folders to the parent folder would exceed the system limitation.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Rename') {
                    switch (code) {
                      case 1200:
                        return 'Failed to rename it. More information in <errors> object.';
                    }
                  }
                  if (api === 'SYNO.FileStation.CopyMove') {
                    switch (code) {
                      case 1000:
                        return 'Failed to copy files/folders. More information in <errors> object.';
                      case 1001:
                        return 'Failed to move files/folders. More information in <errors> object.';
                      case 1002:
                        return 'An error occurred at the destination. More information in <errors> object.';
                      case 1003:
                        return 'Cannot overwrite or skip the existing file because no overwrite parameter is given.';
                      case 1004:
                        return 'File cannot overwrite a folder with the same name, or folder cannot overwrite a file with the same name.';
                      case 1006:
                        return 'Cannot copy/move file/folder with special characters to a FAT32 file system.';
                      case 1007:
                        return 'Cannot copy/move a file bigger than 4G to a FAT32 file system.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Delete') {
                    switch (code) {
                      case 900:
                        return 'Failed to delete file(s)/folder(s). More information in <errors> object.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Extract') {
                    switch (code) {
                      case 1400:
                        return 'Failed to extract files.';
                      case 1401:
                        return 'Cannot open the file as archive.';
                      case 1402:
                        return 'Failed to read archive data error';
                      case 1403:
                        return 'Wrong password.';
                      case 1404:
                        return 'Failed to get the file and dir list in an archive.';
                      case 1405:
                        return 'Failed to find the item ID in an archive file.';
                    }
                  }
                  if (api === 'SYNO.FileStation.Compress') {
                    switch (code) {
                      case 1300:
                        return 'Failed to compress files/folders.';
                      case 1301:
                        return 'Cannot create the archive because the given archive name is too long.';
                    }
                  }
                  switch (code) {
                    case 400:
                      return 'Invalid parameter of file operation';
                    case 401:
                      return 'Unknown error of file operation';
                    case 402:
                      return 'System is too busy';
                    case 403:
                      return 'Invalid user does this file operation';
                    case 404:
                      return 'Invalid group does this file operation';
                    case 405:
                      return 'Invalid user and group does this file operation';
                    case 406:
                      return 'Can\'t get user/group information from the account server';
                    case 407:
                      return 'Operation not permitted';
                    case 408:
                      return 'No such file or directory';
                    case 409:
                      return 'Non-supported file system';
                    case 410:
                      return 'Failed to connect internet-based file system (ex: CIFS)';
                    case 411:
                      return 'Read-only file system';
                    case 412:
                      return 'Filename too long in the non-encrypted file system';
                    case 413:
                      return 'Filename too long in the encrypted file system';
                    case 414:
                      return 'File already exists';
                    case 415:
                      return 'Disk quota exceeded';
                    case 416:
                      return 'No space left on device';
                    case 417:
                      return 'Input/output error';
                    case 418:
                      return 'Illegal name or path';
                    case 419:
                      return 'Illegal file name';
                    case 420:
                      return 'Illegal file name on FAT file system';
                    case 421:
                      return 'Device or resource busy';
                    case 599:
                      return 'No such task of the file operation';
                  }
                  return FileStation.__super__.error.apply(this, arguments);
                };
        
                return FileStation;
        
              })(AuthenticatedAPI);
              return module.exports = FileStation;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('SurveillanceStation', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var SurveillanceStation;
              SurveillanceStation = (function(superClass) {
                extend1(SurveillanceStation, superClass);
        
                function SurveillanceStation() {
                  return SurveillanceStation.__super__.constructor.apply(this, arguments);
                }
        
                SurveillanceStation.prototype.getSurveillanceStationInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Info',
                      version: 1,
                      path: 'entry.cgi',
                      method: 'GetInfo'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listCameras = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'List'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getCameraInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraIds'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'GetInfo'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getCameraCapability = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['vendor', 'model'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'GetCapability'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getCameraCapabilityById = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'GetCapabilityByCamId'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listCameraGroups = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'ListGroup'
                    }
                  });
                };
        
                SurveillanceStation.prototype.enableCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'Enable'
                    }
                  });
                };
        
                SurveillanceStation.prototype.disableCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Camera',
                      version: 8,
                      path: 'entry.cgi',
                      method: 'Disable'
                    }
                  });
                };
        
                SurveillanceStation.prototype.movePTZCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'direction'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'Move'
                    }
                  });
                };
        
                SurveillanceStation.prototype.zoomPTZCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'control'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'Zoom'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listPTZCameraPresets = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'ListPreset'
                    }
                  });
                };
        
                SurveillanceStation.prototype.goPTZCameraToPreset = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'GoPreset'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listPTZCameraPatrols = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'ListPatrol'
                    }
                  });
                };
        
                SurveillanceStation.prototype.runPTZCameraPatrol = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'patrolId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'RunPatrol'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getPTZCameraPatrolsSchedule = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'GetPatrolSchedule'
                    }
                  });
                };
        
                SurveillanceStation.prototype.focusPTZCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'control'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'Focus'
                    }
                  });
                };
        
                SurveillanceStation.prototype.irisPTZCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'control'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'Iris'
                    }
                  });
                };
        
                SurveillanceStation.prototype.autoFocusPTZCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'AutoFocus'
                    }
                  });
                };
        
                SurveillanceStation.prototype.movePTZCameraToAbsolutePosition = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'posX', 'posY'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.PTZ',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'AbsPtz'
                    }
                  });
                };
        
                SurveillanceStation.prototype.recordCamera = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['cameraId', 'action'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.ExternalRecording',
                      version: 2,
                      path: 'entry.cgi',
                      method: 'Record'
                    }
                  });
                };
        
                SurveillanceStation.prototype.queryEvents = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Event',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'Query'
                    }
                  });
                };
        
                SurveillanceStation.prototype.deleteMultiEvents = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['idList'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Event',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'DeleteMulti'
                    }
                  });
                };
        
                SurveillanceStation.prototype.deleteEventFilter = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Event',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'DeleteFilter'
                    }
                  });
                };
        
                SurveillanceStation.prototype.deleteAllEvents = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Event',
                      version: 3,
                      path: 'entry.cgi',
                      method: 'DeleteAll'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listVisualStationsDevices = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Device',
                      version: 2,
                      path: 'SurveillanceStation/device.cgi',
                      method: 'ListVS'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listSlaveDSDevices = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Device',
                      version: 2,
                      path: 'SurveillanceStation/device.cgi',
                      method: 'ListCMS'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getServiceSettingDevice = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Device',
                      version: 2,
                      path: 'SurveillanceStation/device.cgi',
                      method: 'GetServiceSetting'
                    }
                  });
                };
        
                SurveillanceStation.prototype.listEmaps = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Emap',
                      version: 1,
                      path: 'SurveillanceStation/emap.cgi',
                      method: 'List'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getEmapInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['emapIds'],
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Emap',
                      version: 1,
                      path: 'SurveillanceStation/emap.cgi',
                      method: 'GetInfo'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getNotificationRegisterToken = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.SurveillanceStation.Notification',
                      version: 1,
                      path: 'entry.cgi',
                      method: 'GetRegisterToken'
                    }
                  });
                };
        
                SurveillanceStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                SurveillanceStation.prototype.error = function(code, api) {
                  if (api === 'SYNO.SurveillanceStation.Camera' || 'SYNO.SurveillanceStation.PTZ') {
                    switch (code) {
                      case 400:
                        return 'Execution failed';
                      case 401:
                        return 'Parameter invalid';
                      case 402:
                        return 'Camera disabled';
                    }
                  }
                  if (api === 'SYNO.SurveillanceStation.Event' || 'SYNO.SurveillanceStation.Emap') {
                    switch (code) {
                      case 400:
                        return 'Execution failed';
                      case 401:
                        return 'Parameter invalid';
                    }
                  }
                  if (api === 'SYNO.SurveillanceStation.Device') {
                    switch (code) {
                      case 400:
                        return 'Execution failed';
                      case 401:
                        return 'Service is not enabled';
                    }
                  }
                  if (api === 'SYNO.SurveillanceStation.Notification') {
                    switch (code) {
                      case 400:
                        return 'Execution failed';
                    }
                  }
                  return SurveillanceStation.__super__.error.apply(this, arguments);
                };
        
                return SurveillanceStation;
        
              })(AuthenticatedAPI);
              return module.exports = SurveillanceStation;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Syno', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Syno, defaults, request;
              request = require('request');
              defaults = require('lodash').defaults;
              Syno = (function() {
                var defParams;
        
                defParams = {
                  protocol: 'http',
                  host: 'localhost',
                  port: 5000
                };
        
                function Syno(params) {
                  defaults(this, params, defParams);
                  if (!this.account) {
                    throw new Error('Did not specified `account` for syno');
                  }
                  if (!this.passwd) {
                    throw new Error('Did not specified `passwd` for syno');
                  }
                  this.request = request.defaults({
                    jar: true,
                    json: true
                  });
                  this.session = null;
                  this.auth = new Auth(this);
                  this.fs = this.fileStation = new FileStation(this);
                  this.dl = this.downloadStation = new DownloadStation(this);
                  this.as = this.audioStation = new AudioStation(this);
                  this.vs = this.videoStation = new VideoStation(this);
                  this.dtv = this.videoStationDTV = new VideoStationDTV(this);
                  this.ss = this.surveillanceStation = new SurveillanceStation(this);
                }
        
                return Syno;
        
              })();
              return module.exports = Syno;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Utils', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Utils, each, filter, isFunction, isPlainObject, ref;
              ref = require('lodash'), isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, each = ref.each, filter = ref.filter;
              Utils = (function() {
                function Utils() {}
        
                Utils.optionalParamsAndDone = function(options) {
                  var done, params;
                  if (options == null) {
                    options = {};
                  }
                  params = options.params, done = options.done;
                  if (!done) {
                    options.done = isFunction(params) ? params : function() {};
                  }
                  if (!isPlainObject(params)) {
                    options.params = {};
                  }
                  return options;
                };
        
                Utils.checkRequiredParams = function(params, required) {
                  if (required == null) {
                    required = [];
                  }
                  return filter(required, function(key) {
                    return !params[key];
                  });
                };
        
                return Utils;
        
              })();
              return module.exports = Utils;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('VideoStation', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var VideoStation;
              VideoStation = (function(superClass) {
                extend1(VideoStation, superClass);
        
                function VideoStation() {
                  return VideoStation.__super__.constructor.apply(this, arguments);
                }
        
                VideoStation.prototype.getVideoStationInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.Info',
                      version: 1,
                      path: 'VideoStation/info.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listMovies = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.Movie',
                      version: 2,
                      path: 'VideoStation/movie.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchMovie = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Movie',
                      version: 2,
                      path: 'VideoStation/movie.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getMovieInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Movie',
                      version: 1,
                      path: 'VideoStation/movie.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listTVShows = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShow',
                      version: 1,
                      path: 'VideoStation/tvshow.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchTVShow = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShow',
                      version: 1,
                      path: 'VideoStation/tvshow.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getTVShowInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShow',
                      version: 1,
                      path: 'VideoStation/tvshow.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listTVShowEpisodes = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShowEpisode',
                      version: 1,
                      path: 'VideoStation/tvshow_episode.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchTVShowEpisode = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShowEpisode',
                      version: 1,
                      path: 'VideoStation/tvshow_episode.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getTVShowEpisodeInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVShowEpisode',
                      version: 1,
                      path: 'VideoStation/tvshow_episode.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listHomeVideos = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.HomeVideo',
                      version: 2,
                      path: 'VideoStation/homevideo.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchHomeVideo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.HomeVideo',
                      version: 2,
                      path: 'VideoStation/homevideo.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getHomeVideoInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.HomeVideo',
                      version: 1,
                      path: 'VideoStation/homevideo.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listTVRecordings = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVRecording',
                      version: 2,
                      path: 'VideoStation/tvrecord.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchTVRecording = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVRecording',
                      version: 2,
                      path: 'VideoStation/tvrecord.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getTVRecordingInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.TVRecording',
                      version: 1,
                      path: 'VideoStation/tvrecord.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listCollections = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.Collection',
                      version: 2,
                      path: 'VideoStation/collection.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.searchCollection = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Collection',
                      version: 2,
                      path: 'VideoStation/collection.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStation.prototype.getCollectionInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Collection',
                      version: 2,
                      path: 'VideoStation/collection.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listMetadatas = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Metadata',
                      version: 2,
                      path: 'VideoStation/metadata.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.listSubtitles = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.Subtitle',
                      version: 3,
                      path: 'VideoStation/subtitle.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.listAudioTracks = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.AudioTrack',
                      version: 1,
                      path: 'VideoStation/audiotrack.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.listFolders = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.Folder',
                      version: 2,
                      path: 'VideoStation/folder.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.getWatchStatusInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      api: 'SYNO.VideoStation.WatchStatus',
                      version: 1,
                      path: 'VideoStation/watchstatus.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStation.prototype.listLibraries = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.VideoStation.Library',
                      version: 1,
                      path: 'VideoStation/library.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'error'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return VideoStation;
        
              })(AuthenticatedAPI);
              return module.exports = VideoStation;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('VideoStationDTV', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var VideoStationDTV;
              VideoStationDTV = (function(superClass) {
                extend1(VideoStationDTV, superClass);
        
                function VideoStationDTV() {
                  return VideoStationDTV.__super__.constructor.apply(this, arguments);
                }
        
                VideoStationDTV.prototype.startChannelScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.ChannelScan',
                      version: 1,
                      path: 'VideoStation/channelscan.cgi',
                      method: 'start'
                    }
                  });
                };
        
                VideoStationDTV.prototype.stopChannelScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.ChannelScan',
                      version: 1,
                      path: 'VideoStation/channelscan.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                VideoStationDTV.prototype.statusChannelScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.ChannelScan',
                      version: 1,
                      path: 'VideoStation/channelscan.cgi',
                      method: 'status'
                    }
                  });
                };
        
                VideoStationDTV.prototype.startDVBSScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.DVBSScan',
                      version: 1,
                      path: 'VideoStation/dvbsscan.cgi',
                      method: 'start'
                    }
                  });
                };
        
                VideoStationDTV.prototype.stopDVBSScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.DVBSScan',
                      version: 1,
                      path: 'VideoStation/dvbsscan.cgi',
                      method: 'stop'
                    }
                  });
                };
        
                VideoStationDTV.prototype.statusDVBSScan = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.DVBSScan',
                      version: 1,
                      path: 'VideoStation/dvbsscan.cgi',
                      method: 'status'
                    }
                  });
                };
        
                VideoStationDTV.prototype.listDTVChannels = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Channel',
                      version: 1,
                      path: 'VideoStation/channellist.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStationDTV.prototype.getDTVChannelsInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Channel',
                      version: 1,
                      path: 'VideoStation/channellist.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStationDTV.prototype.listDTVPrograms = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Program',
                      version: 1,
                      path: 'VideoStation/programlist.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStationDTV.prototype.searchDTVProgram = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      api: 'SYNO.DTV.Program',
                      version: 1,
                      path: 'VideoStation/programlist.cgi',
                      method: 'search'
                    }
                  });
                };
        
                VideoStationDTV.prototype.listDTVSchedules = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Schedule',
                      version: 1,
                      path: 'VideoStation/schedule_recording.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStationDTV.prototype.getDTVStatusInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Status',
                      version: 1,
                      path: 'VideoStation/dvtstatus.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStationDTV.prototype.getDTVStatisticsInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Statistic',
                      version: 1,
                      path: 'VideoStation/dtvstatistic.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStationDTV.prototype.listDTVTuners = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Tuner',
                      version: 1,
                      path: 'VideoStation/tuner.cgi',
                      method: 'list'
                    }
                  });
                };
        
                VideoStationDTV.prototype.getDTVTunerInfo = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      api: 'SYNO.DTV.Tuner',
                      version: 1,
                      path: 'VideoStation/tuner.cgi',
                      method: 'getinfo'
                    }
                  });
                };
        
                VideoStationDTV.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var results;
                    results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return VideoStationDTV;
        
              })(AuthenticatedAPI);
              return module.exports = VideoStationDTV;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
        }).call(this);
        
    }
    if(typeof module !== 'undefined' && module.exports){
        module.exports = modules['Syno'];
    } else {
        this['Syno'] = modules['Syno'];
    }
}).call(this);