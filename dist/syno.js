/*! mod v1.0.0 | https://github.com/JimRobs/mod */
var mod=function(a){};mod=function(){var a,b,c,d,e;return a={},d={},c={},b=function(b){var e;if(c[b])throw new Error("Cyclic dependency on module "+b);if(d.hasOwnProperty(b))return d[b];if(!a.hasOwnProperty(b))throw new Error("No module found for key "+b);return c[b]=!0,e=d[b]=a[b](),c[b]=!1,a[b]=null,e},e=function(b,e){if(a.hasOwnProperty(b)||d.hasOwnProperty(b))throw new Error("The module with key "+b+" already exists");return a[b]=e,c[b]=!1},function(a,c){return c?e(a,c):b(a)}}();
var syno,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

syno = {
  "API": "syno.API",
  "AudioStation": "syno.AudioStation",
  "Auth": "syno.Auth",
  "AuthenticatedAPI": "syno.AuthenticatedAPI",
  "DownloadStation": "syno.DownloadStation",
  "FileStation": "syno.FileStation",
  "Syno": "syno.Syno",
  "Utils": "syno.Utils"
};

mod(syno.API, function() {
  var API, Utils, defaults, extend, _ref;
  _ref = require('lodash'), extend = _ref.extend, defaults = _ref.defaults;
  Utils = mod(syno.Utils);
  API = (function() {
    var noop;

    noop = function() {};

    function API(syno) {
      this.syno = syno;
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
      url = "" + protocol + "://" + host + ":" + port + "/webapi/" + path;
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
  return API;
});

mod(syno.AudioStation, function() {
  var AudioStation, AuthenticatedAPI;
  AuthenticatedAPI = mod(syno.AuthenticatedAPI);
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
  return AudioStation;
});

mod(syno.Auth, function() {
  var API, Auth;
  API = mod(syno.API);
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
  return Auth;
});

mod(syno.AuthenticatedAPI, function() {
  var API, AuthenticatedAPI;
  API = mod(syno.API);
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
  return AuthenticatedAPI;
});

mod(syno.DownloadStation, function() {
  var AuthenticatedAPI, DownloadStation;
  AuthenticatedAPI = mod(syno.AuthenticatedAPI);
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
  return DownloadStation;
});

mod(syno.FileStation, function() {
  var AuthenticatedAPI, FileStation, Utils, defaults;
  defaults = require('lodash').defaults;
  AuthenticatedAPI = mod(syno.AuthenticatedAPI);
  Utils = mod(syno.Utils);
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
      url = "" + protocol + "://" + host + ":" + port + "/webapi/" + path;
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
      url = "" + protocol + "://" + host + ":" + port + "/webapi/" + path;
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
  return FileStation;
});

mod(syno.Syno, function() {
  var AudioStation, Auth, DownloadStation, FileStation, Syno, defaults, request;
  request = require('request');
  defaults = require('lodash').defaults;
  Auth = mod(syno.Auth);
  FileStation = mod(syno.FileStation);
  DownloadStation = mod(syno.DownloadStation);
  AudioStation = mod(syno.AudioStation);
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
  return Syno;
});

mod(syno.Utils, function() {
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
          throw new Error("" + key + " param is required");
        }
      });
    };

    return Utils;

  })();
  return Utils;
});

module.exports = mod(syno.Syno);
(function(){function setter(){throw new Error("Cannot manually set module property")}function setModule(a,b){if(modules.hasOwnProperty(a))throw new Error("Module "+a+" already exists.");var c;Object.defineProperty(modules,a,{get:function(){if(c)return c;if(b.busy)throw new Error("Cyclic dependency detected on module "+a);return b.busy=!0,c=b(),b.busy=!1,c},set:setter})}var modules={};with(modules)(function(){var a=function(a,c){function d(){this.constructor=a}for(var e in c)b.call(c,e)&&(a[e]=c[e]);return d.prototype=c.prototype,a.prototype=new d,a.__super__=c.prototype,a},b={}.hasOwnProperty;setModule("API",function(){var a,b;return b={},a=b.exports={},function(a,b){var c,d,e,f;return f=require("lodash"),e=f.extend,d=f.defaults,c=function(){function a(a){this.syno=a}var b;return b=function(){},a.prototype.request=function(a,c){var e,f,g,h,i,j,k,l,m,n,o;return null==a&&(a={}),null==c&&(c=b),o=this.syno,k=o.protocol,f=o.host,j=o.port,e=a.api,n=a.version,i=a.path,g=a.method,h=a.params,m=k+"://"+f+":"+j+"/webapi/"+i,l=d({api:e,version:n,method:g},h),this.syno.request({url:m,qs:l},function(a,b,d){return a?c(a):200!==b.statusCode?c(b.statusCode):d.success?c(null,d.data):c(JSON.stringify(d.error,null,4))})},a.prototype.requestAPI=function(a){var b,c,d,f,g,h;return b=a.apiInfos,g=a.requiredParams,f=a.params,c=a.done,h=Utils.optionalParamsAndDone({params:f,done:c}),f=h.params,c=h.done,Utils.checkRequiredParams(f,g),d=e({},b,{params:f}),this.request(d,c)},a}(),b.exports=c}(modules,b,a,void 0,void 0),b.exports}),setModule("Auth",function(){var b,c;return c={},b=c.exports={},function(b,c){var d;return d=function(b){function c(){return c.__super__.constructor.apply(this,arguments)}var d,e,f;return a(c,b),d="SYNO.API.Auth",f=3,e="auth.cgi",c.prototype.login=function(a){var b,c,g;return b="login",g="SYNO_SESSION_"+Date.now(),c={account:this.syno.account,passwd:this.syno.passwd,session:g},this.syno.session=g,this.request({api:d,version:f,path:e,method:b,params:c},a)},c.prototype.logout=function(a){var b,c;return this.syno.session?(b="logout",c={session:this.syno.session},this.syno.session=null,this.request({api:d,version:f,path:e,method:b,params:c},a)):null},c}(API),c.exports=d}(modules,c,b,void 0,void 0),c.exports}),setModule("AuthenticatedAPI",function(){var b,c;return c={},b=c.exports={},function(b,c){var d;return d=function(b){function c(){return c.__super__.constructor.apply(this,arguments)}var d;return a(c,b),d=function(){},c.prototype.request=function(a,b){return null==b&&(b=d),this.syno.session?c.__super__.request.call(this,a,b):this.syno.auth.login(function(d){return function(e){return e?b(e):c.__super__.request.call(d,a,b)}}(this))},c}(API),c.exports=d}(modules,c,b,void 0,void 0),c.exports}),setModule("DownloadStation",function(){var b,c;return c={},b=c.exports={},function(b,c){var d;return d=function(b){function c(){return c.__super__.constructor.apply(this,arguments)}return a(c,b),c.prototype.getDownloadStationInfo=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Info",version:1,path:"DownloadStation/info.cgi",method:"getinfo"}})},c.prototype.getDownloadStationConfig=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Info",version:1,path:"DownloadStation/info.cgi",method:"getconfig"}})},c.prototype.setDownloadStationConfig=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Info",version:1,path:"DownloadStation/info.cgi",method:"setserverconfig"}})},c.prototype.getScheduleConfig=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Schedule",version:1,path:"DownloadStation/schedule.cgi",method:"getconfig"}})},c.prototype.setScheduleConfig=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Schedule",version:1,path:"DownloadStation/schedule.cgi",method:"setconfig"}})},c.prototype.listTasks=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Task",version:1,path:"DownloadStation/task.cgi",method:"list"}})},c.prototype.getTasksInfo=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.Task",version:1,path:"DownloadStation/task.cgi",method:"getinfo"}})},c.prototype.createTask=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Task",version:3,path:"DownloadStation/task.cgi",method:"create"}})},c.prototype.deleteTasks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.Task",version:1,path:"DownloadStation/task.cgi",method:"delete"}})},c.prototype.pauseTasks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.Task",version:1,path:"DownloadStation/task.cgi",method:"pause"}})},c.prototype.resumeTasks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.Task",version:1,path:"DownloadStation/task.cgi",method:"resume"}})},c.prototype.editTasks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.Task",version:2,path:"DownloadStation/task.cgi",method:"edit"}})},c.prototype.getStats=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.Statistic",version:1,path:"DownloadStation/statistic.cgi",method:"getinfo"}})},c.prototype.listRSSSites=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.RSS.Site",version:1,path:"DownloadStation/RSSsite.cgi",method:"list"}})},c.prototype.refreshRSSSites=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.DownloadStation.RSS.Site",version:1,path:"DownloadStation/RSSsite.cgi",method:"refresh"}})},c.prototype.listRSSFeeds=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.RSS.Feed",version:1,path:"DownloadStation/RSSfeed.cgi",method:"list"}})},c.prototype.startBTSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["keyword","module"],apiInfos:{api:"SYNO.DownloadStation.BTSearch",version:1,path:"DownloadStation/btsearch.cgi",method:"start"}})},c.prototype.listBTSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.DownloadStation.BTSearch",version:1,path:"DownloadStation/btsearch.cgi",method:"start"}})},c.prototype.getBTSearchCategories=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.BTSearch",version:1,path:"DownloadStation/btsearch.cgi",method:"getCategory"}})},c.prototype.cleanBTSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.DownloadStation.BTSearch",version:1,path:"DownloadStation/btsearch.cgi",method:"clean"}})},c.prototype.getBTSearchModules=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.DownloadStation.BTSearch",version:1,path:"DownloadStation/btsearch.cgi",method:"getModule"}})},c}(AuthenticatedAPI),c.exports=d}(modules,c,b,void 0,void 0),c.exports}),setModule("FileStation",function(){var b,c;return c={},b=c.exports={},function(b,c){var d,e;return e=require("lodash").defaults,d=function(b){function c(){return c.__super__.constructor.apply(this,arguments)}var d,f;return a(c,b),c.prototype.getFileStationInfo=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.Info",version:1,path:"FileStation/info.cgi",method:"getinfo"}})},c.prototype.listSharedFolders=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.List",version:1,path:"FileStation/file_share.cgi",method:"list_share"}})},c.prototype.listFiles=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["folder_path"],apiInfos:{api:"SYNO.FileStation.List",version:1,path:"FileStation/file_share.cgi",method:"list"}})},c.prototype.getFilesInfo=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.List",version:1,path:"FileStation/file_share.cgi",method:"getinfo"}})},c.prototype.startSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["folder_path"],apiInfos:{api:"SYNO.FileStation.Search",version:1,path:"FileStation/file_find.cgi",method:"start"}})},c.prototype.stopSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Search",version:1,path:"FileStation/file_find.cgi",method:"stop"}})},c.prototype.listSearch=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Search",version:1,path:"FileStation/file_find.cgi",method:"list"}})},c.prototype.cleanSearches=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Search",version:1,path:"FileStation/file_find.cgi",method:"clean"}})},c.prototype.listVirtualFolders=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["type"],apiInfos:{api:"SYNO.FileStation.VirtualFolder",version:1,path:"FileStation/file_virtual.cgi",method:"list"}})},c.prototype.listFavorites=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"list"}})},c.prototype.addFavorite=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","name"],apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"list"}})},c.prototype.deleteFavorite=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"delete"}})},c.prototype.cleanBrokenFavorites=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"delete"}})},c.prototype.editFavorite=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","name"],apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"edit"}})},c.prototype.replaceAllFavorites=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","name"],apiInfos:{api:"SYNO.FileStation.Favorite",version:1,path:"FileStation/file_favorite.cgi",method:"replace_all"}})},c.prototype.getThumbnail=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.Thumb",version:1,path:"FileStation/file_thumb.cgi",method:"get"}})},c.prototype.startDirSize=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.DirSize",version:1,path:"FileStation/file_dirSize.cgi",method:"start"}})},c.prototype.statusDirSize=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.DirSize",version:1,path:"FileStation/file_dirSize.cgi",method:"status"}})},c.prototype.stopDirSize=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.DirSize",version:1,path:"FileStation/file_dirSize.cgi",method:"stop"}})},c.prototype.startMD5=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["file_path"],apiInfos:{api:"SYNO.FileStation.MD5",version:1,path:"FileStation/file_md5.cgi",method:"start"}})},c.prototype.statusMD5=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.MD5",version:1,path:"FileStation/file_md5.cgi",method:"status"}})},c.prototype.stopMD5=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.MD5",version:1,path:"FileStation/file_md5.cgi",method:"stop"}})},c.prototype.checkWritePermission=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.MD5",version:1,path:"FileStation/file_md5.cgi",method:"status"}})},c.prototype.getSharingLinkInfo=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"getinfo"}})},c.prototype.listSharingLinks=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"list"}})},c.prototype.createSharingLinks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"create"}})},c.prototype.deleteSharingLinks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"delete"}})},c.prototype.clearInvalidSharingLinks=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"clear_invalid"}})},c.prototype.editSharingLinks=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["id"],apiInfos:{api:"SYNO.FileStation.Sharing",version:1,path:"FileStation/file_sharing.cgi",method:"edit"}})},c.prototype.createFolder=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","name"],apiInfos:{api:"SYNO.FileStation.CreateFolder",version:1,path:"FileStation/file_crtfdr.cgi",method:"create"}})},c.prototype.rename=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","name"],apiInfos:{api:"SYNO.FileStation.Rename",version:1,path:"FileStation/file_rename.cgi",method:"rename"}})},c.prototype.startCopyMove=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","dest_folder_path"],apiInfos:{api:"SYNO.FileStation.CopyMove",version:1,path:"FileStation/file_MVCP.cgi",method:"start"}})},c.prototype.statusCopyMove=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.CopyMove",version:1,path:"FileStation/file_MVCP.cgi",method:"status"}})},c.prototype.stopCopyMove=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.CopyMove",version:1,path:"FileStation/file_MVCP.cgi",method:"stop"}})},c.prototype.startDelete=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.Delete",version:1,path:"FileStation/file_delete.cgi",method:"start"}})},c.prototype.statusDelete=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Delete",version:1,path:"FileStation/file_delete.cgi",method:"status"}})},c.prototype.stopDelete=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Delete",version:1,path:"FileStation/file_delete.cgi",method:"stop"}})},c.prototype["delete"]=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path"],apiInfos:{api:"SYNO.FileStation.Delete",version:1,path:"FileStation/file_delete.cgi",method:"delete"}})},c.prototype.startExtract=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["file_path","dest_folder_path"],apiInfos:{api:"SYNO.FileStation.Extract",version:1,path:"FileStation/file_extract.cgi",method:"start"}})},c.prototype.statusExtract=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Extract",version:1,path:"FileStation/file_extract.cgi",method:"status"}})},c.prototype.stopExtract=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Extract",version:1,path:"FileStation/file_extract.cgi",method:"stop"}})},c.prototype.listArchiveFiles=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["file_path"],apiInfos:{api:"SYNO.FileStation.Extract",version:1,path:"FileStation/file_extract.cgi",method:"list"}})},c.prototype.startCompress=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["path","dest_file_path"],apiInfos:{api:"SYNO.FileStation.Compress",version:1,path:"FileStation/file_compress.cgi",method:"start"}})},c.prototype.statusCompress=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Compress",version:1,path:"FileStation/file_compress.cgi",method:"status"}})},c.prototype.stopCompress=function(a,b){return this.requestAPI({params:a,done:b,requiredParams:["taskid"],apiInfos:{api:"SYNO.FileStation.Compress",version:1,path:"FileStation/file_compress.cgi",method:"stop"}})},c.prototype.listBackgroundTasks=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.BackgroundTask",version:1,path:"FileStation/background_task.cgi",method:"list"}})},c.prototype.clearFinishedBackgroundTasks=function(a,b){return this.requestAPI({params:a,done:b,apiInfos:{api:"SYNO.FileStation.BackgroundTask",version:1,path:"FileStation/background_task.cgi",method:"clear_finished"}})},f=function(a,b,c){var d,f,g,h,i,j,k,l,m,n;return n=Utils.optionalParamsAndDone({params:b,done:c}),b=n.params,c=n.done,Utils.checkRequiredParams(b,["dest_folder_path","filename"]),k=a.protocol,g=a.host,j=a.port,d="SYNO.FileStation.Upload",m="1",i="FileStation/api_upload.cgi",h="upload",l=k+"://"+g+":"+j+"/webapi/"+i,f=e({api:d,version:m,method:h},b),a.request.post({url:l,formData:f},function(a,b,d){return c(a?a:200!==b.statusCode?b.statusCode:d.success?null:d.error)})},c.prototype.upload=function(a,b){var c;return c=this.syno,c.session?f(c,a,b):c.auth.login(function(d){return d?b(d):f(c,a,b)})},d=function(a,b,c){var d,f,g,h,i,j,k,l,m,n,o;return o=Utils.optionalParamsAndDone({params:b,done:c}),b=o.params,c=o.done,Utils.checkRequiredParams(b,["path","stream"]),l=b.stream,delete b.stream,j=a.protocol,f=a.host,i=a.port,d="SYNO.FileStation.Download",n=1,h="FileStation/file_download.cgi",g="download",m=j+"://"+f+":"+i+"/webapi/"+h,k=e({api:d,version:n,method:g},b),a.request({url:m,qs:k,json:!1}).on("error",function(a){return c(a)}).on("end",function(){return c(null)}).pipe(l)},c.prototype.download=function(a,b){var c;return c=this.syno,c.session?d(c,a,b):c.auth.login(function(e){return e?b(e):d(c,a,b)})},c}(AuthenticatedAPI),c.exports=d}(modules,c,b,void 0,void 0),c.exports}),setModule("Syno",function(){var a,b;return b={},a=b.exports={},function(a,b){var c,d,e;return e=require("request"),d=require("lodash").defaults,c=function(){function a(a){if(d(this,a,b),!this.account)throw new Error("Did not specified `account` for syno");if(!this.passwd)throw new Error("Did not specified `passwd` for syno");this.request=e.defaults({jar:!0,json:!0}),this.session=null,this.auth=new Auth(this),this.fs=this.fileStation=new FileStation(this),this.dl=this.downloadStation=new DownloadStation(this)}var b;return b={protocol:"http",host:"localhost",port:5e3},a}(),b.exports=c}(modules,b,a,void 0,void 0),b.exports}),setModule("Utils",function(){var a,b;return b={},a=b.exports={},function(a,b){var c,d,e,f,g;return g=require("lodash"),e=g.isFunction,f=g.isPlainObject,d=g.each,c=function(){function a(){}return a.optionalParamsAndDone=function(a){var b,c;return null==a&&(a={}),c=a.params,b=a.done,b||(a.done=e(c)?c:function(){}),f(c)||(a.params={}),a},a.checkRequiredParams=function(a,b){return null==b&&(b=[]),d(b,function(b){if(!a[b])throw new Error(b+" param is required")})},a}(),b.exports=c}(modules,b,a,void 0,void 0),b.exports})}).call(this);"undefined"!=typeof module&&module.exports?module.exports=modules.Syno:this.Syno=modules.Syno}).call(this);