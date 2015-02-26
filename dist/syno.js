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
          var __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            __hasProp = {}.hasOwnProperty;
        
          setModule('API', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var API, defaults, extend, _ref;
              _ref = require('lodash'), extend = _ref.extend, defaults = _ref.defaults;
              API = (function() {
                var noop;
        
                noop = function() {};
        
                function API(_at_syno) {
                  this.syno = _at_syno;
                }
        
                API.prototype.request = function(options, done) {
                  var api, host, method, params, path, port, protocol, qs, url, version, _ref1;
                  if (options == null) {
                    options = {};
                  }
                  if (done == null) {
                    done = noop;
                  }
                  _ref1 = this.syno, protocol = _ref1.protocol, host = _ref1.host, port = _ref1.port;
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
                  }, function(error, response, body) {
                    if (error) {
                      return done(error);
                    }
                    if (response.statusCode !== 200) {
                      return done(response.statusCode);
                    }
                    if (!body.success) {
                      return done(JSON.stringify(body.error, null, 4));
                    }
                    return done(null, body.data);
                  });
                };
        
                API.prototype.requestAPI = function(args) {
                  var apiInfos, done, opts, params, requiredParams, _ref1;
                  apiInfos = args.apiInfos, requiredParams = args.requiredParams, params = args.params, done = args.done;
                  _ref1 = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = _ref1.params, done = _ref1.done;
                  Utils.checkRequiredParams(params, requiredParams);
                  opts = extend({}, apiInfos, {
                    params: params
                  });
                  return this.request(opts, done);
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
              AudioStation = (function(_super) {
                __extends(AudioStation, _super);
        
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
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var _results;
                    _results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        _results.push(k);
                      }
                    }
                    return _results;
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
              Auth = (function(_super) {
                var api, path, version;
        
                __extends(Auth, _super);
        
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
              AuthenticatedAPI = (function(_super) {
                var noop;
        
                __extends(AuthenticatedAPI, _super);
        
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
              DownloadStation = (function(_super) {
                __extends(DownloadStation, _super);
        
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
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var _results;
                    _results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        _results.push(k);
                      }
                    }
                    return _results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
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
              FileStation = (function(_super) {
                var download, upload;
        
                __extends(FileStation, _super);
        
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
                    requiredParams: ['path', 'name'],
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
                  var api, formData, host, method, path, port, protocol, url, version, _ref;
                  _ref = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = _ref.params, done = _ref.done;
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
                  var api, host, method, path, port, protocol, qs, stream, url, version, _ref;
                  _ref = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = _ref.params, done = _ref.done;
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
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var _results;
                    _results = [];
                    for (k in this) {
                      v = this[k];
                      if (typeof v === 'function') {
                        _results.push(k);
                      }
                    }
                    return _results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return FileStation;
        
              })(AuthenticatedAPI);
              return module.exports = FileStation;
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
              var Utils, each, isFunction, isPlainObject, _ref;
              _ref = require('lodash'), isFunction = _ref.isFunction, isPlainObject = _ref.isPlainObject, each = _ref.each;
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
                  return each(required, function(key) {
                    if (!params[key]) {
                      throw new Error(key + " param is required");
                    }
                  });
                };
        
                return Utils;
        
              })();
              return module.exports = Utils;
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