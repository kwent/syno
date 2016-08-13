(function(){
    var modules = {};
    function setter(){ throw new Error('Cannot manually set module property'); }
    function setModule(name, factory){
        if(modules.hasOwnProperty(name)){
            throw new Error('Module '+name+' already exists.');
        }
        Object.defineProperty(modules, name, {
            get: function(){
                if(factory.busy) {
                    throw new Error('Cyclic dependency detected on module '+name);
                }
                factory.busy = true;
                var value = factory();
                Object.defineProperty(modules, name, {
                    value: value
                });
                factory.busy = false;
                return value;
            },
            set: setter,
            enumerable: true,
            configurable: true
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
        
                function API(syno) {
                  this.syno = syno;
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
                  var apiInfos, done, opts, params, ref1, requiredParams;
                  apiInfos = args.apiInfos, requiredParams = args.requiredParams, params = args.params, done = args.done;
                  ref1 = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = ref1.params, done = ref1.done;
                  params = mapValues(params, function(param) {
                    return param && param.toString();
                  });
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
        
                function AudioStation(syno) {
                  this.syno = syno;
                  AudioStation.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.AudioStation']);
                }
        
                AudioStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
        
          setModule('DSM', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var DSM;
              DSM = (function(superClass) {
                extend1(DSM, superClass);
        
                function DSM(syno) {
                  this.syno = syno;
                  DSM.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.DSM', 'SYNO.Core']);
                }
        
                DSM.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
        
                return DSM;
        
              })(AuthenticatedAPI);
              return module.exports = DSM;
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
        
                function DownloadStation(syno) {
                  this.syno = syno;
                  DownloadStation.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.DownloadStation']);
                }
        
                DownloadStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
              var FileStation;
              FileStation = (function(superClass) {
                extend1(FileStation, superClass);
        
                function FileStation(syno) {
                  this.syno = syno;
                  FileStation.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.FileStation']);
                }
        
                FileStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
        
                function SurveillanceStation(syno) {
                  this.syno = syno;
                  SurveillanceStation.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.SurveillanceStation']);
                }
        
                SurveillanceStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
              var Syno, defaults, endsWith, filter, first, flatten, fs, isArray, keys, last, mapValues, merge, path, ref, request, some, startsWith, values;
              request = require('request');
              fs = require('fs');
              path = require('path');
              ref = require('lodash'), defaults = ref.defaults, mapValues = ref.mapValues, keys = ref.keys, values = ref.values, flatten = ref.flatten, filter = ref.filter, first = ref.first, last = ref.last, some = ref.some, merge = ref.merge, isArray = ref.isArray, startsWith = ref.startsWith, endsWith = ref.endsWith;
              Syno = (function() {
                var apiVersionsAvailable, defParams;
        
                defParams = {
                  account: process.env.SYNO_ACCOUNT,
                  passwd: process.env.SYNO_PASSWORD,
                  protocol: process.env.SYNO_PROTOCOL || 'http',
                  host: process.env.SYNO_HOST || 'localhost',
                  port: process.env.SYNO_PORT || 5000,
                  apiVersion: process.env.SYNO_API_VERSION || '6.0',
                  debug: process.env.SYNO_DEBUG || false,
                  ignoreCertificateErrors: process.env.SYNO_IGNORE_CERTIFICATE_ERRORS || false
                };
        
                apiVersionsAvailable = ['5.0', '5.1', '5.2', '6.0'];
        
                function Syno(params) {
                  defaults(this, params, defParams);
                  if (this.debug) {
                    console.log("[DEBUG] : Account: " + this.account);
                  }
                  if (this.debug) {
                    console.log("[DEBUG] : Password: " + this.passwd);
                  }
                  if (this.debug) {
                    console.log("[DEBUG] : Host: " + this.host);
                  }
                  if (this.debug) {
                    console.log("[DEBUG] : Port: " + this.port);
                  }
                  if (this.debug) {
                    console.log("[DEBUG] : API: " + this.apiVersion);
                  }
                  if (this.debug) {
                    console.log("[DEBUG] : Ignore certificate errors: " + this.ignoreCertificateErrors);
                  }
                  if (!this.account) {
                    throw new Error('Did not specified `account` for syno');
                  }
                  if (!this.passwd) {
                    throw new Error('Did not specified `passwd` for syno');
                  }
                  if (!(new RegExp(apiVersionsAvailable.join('|')).test(this.apiVersion))) {
                    throw new Error("Api version: " + this.apiVersion + " is not available. Available versions are: " + (apiVersionsAvailable.join(', ')));
                  }
                  this.request = request.defaults({
                    rejectUnauthorized: !this.ignoreCertificateErrors,
                    jar: true,
                    json: true
                  });
                  if (this.debug) {
                    request.debug = true;
                  }
                  this.session = null;
                  this.auth = new Auth(this);
                  this.dsm = this.diskStationManager = new DSM(this);
                  this.fs = this.fileStation = new FileStation(this);
                  this.dl = this.downloadStation = new DownloadStation(this);
                  this.as = this.audioStation = new AudioStation(this);
                  this.vs = this.videoStation = new VideoStation(this);
                  this.dtv = this.videoStationDTV = new VideoStationDTV(this);
                  this.ss = this.surveillanceStation = new SurveillanceStation(this);
                }
        
                Syno.prototype.loadDefinitions = function() {
                  if (this.definitions) {
                    return this.definitions;
                  }
                  majorVersion = (this.apiVersion.charAt(0)) + ".x";
                  this.definitions = JSON.parse(fs.readFileSync(__dirname + "/../definitions/6.x/_full.json", "utf8"));
                  return this.definitions;
                };
        
                Syno.prototype.createFunctionsFor = function(object, apis) {
                  var api, apiKeys, definitions, functionName, i, lastApiVersionMethods, len, method, results, version;
                  definitions = this.loadDefinitions();
                  results = [];
                  for (i = 0, len = apis.length; i < len; i++) {
                    api = apis[i];
                    apiKeys = filter(keys(definitions), function(key) {
                      return startsWith(key, api);
                    });
                    results.push((function() {
                      var j, len1, results1;
                      results1 = [];
                      for (j = 0, len1 = apiKeys.length; j < len1; j++) {
                        api = apiKeys[j];
                        if (definitions[api].methods) {
                          lastApiVersionMethods = definitions[api].methods[last(keys(definitions[api].methods))];
                          if (!some(lastApiVersionMethods, function(m) {
                            return typeof m === 'string';
                          })) {
                            lastApiVersionMethods = flatten(values(mapValues(lastApiVersionMethods, function(m) {
                              return keys(m);
                            })));
                          }
                          results1.push((function() {
                            var l, len2, results2;
                            results2 = [];
                            for (l = 0, len2 = lastApiVersionMethods.length; l < len2; l++) {
                              method = lastApiVersionMethods[l];
                              if (typeof method === 'object') {
                                method = first(keys(method));
                              }
                              functionName = Utils.createFunctionName(api, method);
                              path = 'path' in definitions[api] ? definitions[api].path : 'entry.cgi';
                              version = 'minVersion' in definitions[api] ? definitions[api].minVersion : 1;
                              results2.push(object.__proto__[functionName] = new Function('params', 'done', 'this.requestAPI({ params: params, done: done, apiInfos: { api: ' + "'" + api + "'" + ', version:' + "'" + version + "'" + ', path: ' + "'" + path + "'" + ', method: ' + "'" + method + "'" + '} });'));
                            }
                            return results2;
                          })());
                        } else {
                          results1.push(void 0);
                        }
                      }
                      return results1;
                    })());
                  }
                  return results;
                };
        
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
              var Utils, camelCase, each, endsWith, filter, isFunction, isPlainObject, last, pluralize, ref, startsWith;
              ref = require('lodash'), isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, each = ref.each, filter = ref.filter, camelCase = ref.camelCase, startsWith = ref.startsWith, endsWith = ref.endsWith, last = ref.last;
              pluralize = require('pluralize');
              Utils = (function() {
                function Utils() {}
        
                Utils.underscoreToCamelize = function(str) {
                  str = str.replace(/(\_[a-z])/g, function($1) {
                    return $1.toUpperCase().replace('_', '');
                  });
                  return str.substring(0, 1).toLowerCase() + str.slice(1);
                };
        
                Utils.trimSyno = function(str) {
                  str = str.replace(/SYNO\./, '');
                  return str.replace(/\./g, function($1) {
                    return $1.replace('.', '');
                  });
                };
        
                Utils.trimSynoNamespace = function(str) {
                  return str.split('.')[1];
                };
        
                Utils.fixCamelCase = function(str) {
                  var i, idx, len, word, words;
                  words = ['ack', 'add', 'apply', 'archive', 'arrange', 'audio', 'auth', 'bat', 'break', 'cam', 'card', 'category', 'check', 'chk', 'clear', 'close', 'compare', 'config', 'control', 'copy', 'count', 'create', 'delete', 'del', 'disabled', 'disable', 'door', 'download', 'edit', 'eject', 'enable', 'enabled', 'enum', 'event', 'export', 'force', 'format', 'get', 'go', 'holder', 'imported', 'import', 'info', 'io', 'keep', 'list', 'live', 'load', 'unlock', 'lock', 'log', 'mark', 'md', 'migration', 'modify', 'module', 'monitor', 'motion', 'notify', 'ntp', 'open', 'unpair', 'pair', 'play', 'poll', 'polling', 'query', 'quick', 'record', 'rec', 'recount', 'redirect', 'remove', 'resync', 'retrieve', 'roi', 'run', 'save', 'search', 'selected', 'select', 'send', 'server', 'set', 'setting', 'share', 'snapshot', 'start', 'stop', 'stream', 'sync', 'test', 'trigger', 'updated', 'update', 'upload', 'verify', 'view', 'volume'];
                  for (idx = i = 0, len = words.length; i < len; idx = ++i) {
                    word = words[idx];
                    str = str.replace(RegExp(word + ".", 'i'), function($1) {
                      var match;
                      match = $1.slice(0, -1).toLowerCase();
                      if (!(words.slice(0, idx).some(function(el) {
                        return el.indexOf(match) >= 0;
                      }))) {
                        return $1.charAt(0).toUpperCase() + $1.slice(1, -1) + $1.charAt($1.length - 1).toUpperCase();
                      } else {
                        return $1;
                      }
                    });
                  }
                  return str;
                };
        
                Utils.deletePattern = function(str, pattern) {
                  var regex;
                  regex = new RegExp(pattern, 'i');
                  return str = str.replace(regex, '');
                };
        
                Utils.listPluralize = function(method, apiSubNname) {
                  var lastWord;
                  if (startsWith(method.toLowerCase(), 'list') && !endsWith(apiSubNname, 's')) {
                    lastWord = last(apiSubNname.split(/(?=[A-Z][^A-Z]+$)/));
                    apiSubNname = pluralize(lastWord);
                  }
                  return apiSubNname;
                };
        
                Utils.createFunctionName = function(apiName, method) {
                  var functionName, nameSpace;
                  nameSpace = Utils.trimSynoNamespace(apiName);
                  apiName = Utils.trimSyno(apiName);
                  apiName = Utils.deletePattern(apiName, nameSpace);
                  apiName = Utils.deletePattern(apiName, method);
                  method = Utils.deletePattern(method, apiName);
                  method = Utils.fixCamelCase(method);
                  apiName = Utils.listPluralize(method, apiName);
                  functionName = "" + method + apiName;
                  return functionName = camelCase(functionName);
                };
        
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
        
                function VideoStation(syno) {
                  this.syno = syno;
                  VideoStation.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.VideoStation']);
                }
        
                VideoStation.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
        
                function VideoStationDTV(syno) {
                  this.syno = syno;
                  VideoStationDTV.__super__.constructor.call(this, this.syno);
                  this.syno.createFunctionsFor(this, ['SYNO.DTV']);
                }
        
                VideoStationDTV.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods', 'loadDefinitions', 'error'];
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
