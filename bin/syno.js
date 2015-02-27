#!/usr/bin/env node

var CONFIG_DIR, CONFIG_FILE, DEFAULT_ACCOUNT, DEFAULT_HOST, DEFAULT_PASSWD, DEFAULT_PORT, DEFAULT_PROTOCOL, Syno, execute, fs, nconf, os, path, program, syno, url, url_resolved, yaml;

CONFIG_DIR = '.syno';

CONFIG_FILE = 'config.yaml';

DEFAULT_PROTOCOL = 'https';

DEFAULT_HOST = 'localhost';

DEFAULT_PORT = 5001;

DEFAULT_ACCOUNT = 'admin';

DEFAULT_PASSWD = 'password';

program = require('commander');

fs = require('fs');

url = require('url');

nconf = require('nconf');

path = require('path-extra');

yaml = require('js-yaml');

Syno = require('../dist/syno');

os = require('os');

execute = function(api, cmd, options) {
  var exception, payload;
  if (program.debug) {
    console.log('[DEBUG] : Method name configured : %s', cmd);
  }
  if (options.payload && program.debug) {
    console.log('[DEBUG] : JSON payload configured : %s', options.payload);
  }
  if (options.pretty && program.debug) {
    console.log('[DEBUG] : Prettify output detected');
  }
  try {
    payload = JSON.parse(options.payload || '{}');
  } catch (_error) {
    exception = _error;
    console.log('[ERROR] : JSON Exception : %s', exception);
    process.exit(1);
  }
  return syno[api][cmd](payload, function(err, data) {
    if (err) {
      console.log('[ERROR] : %s', err);
    }
    if (options.pretty) {
      data = JSON.stringify(data, void 0, 2);
    } else {
      data = JSON.stringify(data);
    }
    if (data) {
      console.log(data);
    }
    syno.auth.logout();
    return process.exit(0);
  });
};

program.version('1.0.4').description('Synology Rest API Command Line').option('-c, --config <path>', "DSM Configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Commands:');
  console.log('');
  console.log('    filestation|fs [options] <method>  DSM File Station API');
  console.log('    downloadstation|dl [options] <method>  DSM Download Station API');
  console.log('    audiostation|as [options] <method>  DSM Audio Station API');
  console.log('    videostation|vs [options] <method>  DSM Video Station API');
  return console.log('');
}).on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno filestation|fs getFileStationInfo');
  console.log('    $ syno downloadstation|dl getDownloadStationInfo');
  console.log('    $ syno audiostation|as getAudioStationInfo');
  console.log('    $ syno videostation|vs getVideoStationInfo');
  return console.log('');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
} else if (program.args.length > 0 && program.args[0] !== 'filestation' && program.args[0] !== 'downloadstation' && program.args[0] !== 'audiostation' && program.args[0] !== 'videostation' && program.args[0] !== 'videostationdtv' && program.args[0] !== 'fs' && program.args[0] !== 'dl' && program.args[0] !== 'as' && program.args[0] !== 'vs' && program.args[0] !== 'dtv') {
  console.log('');
  console.log("  [ERROR] : " + program.args[0] + " is not a valid command !");
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno filestation|fs [options] <method> DSM File Station API');
  console.log('    $ syno downloadstation|dl [options] <method> DSM Download Station API');
  console.log('    $ syno audiostation|as [options] <method> DSM Audio Station API');
  console.log('    $ syno videostation|vs [options] <method> DSM Video Station API');
  console.log('');
  process.exit(1);
}

nconf.argv.env;

if (program.url) {
  if (program.debug) {
    console.log('[DEBUG] : Params URL detected : %s.', program.url);
  }
  url_resolved = url.parse(program.url);
  if (!url_resolved.protocol) {
    url_resolved = url.parse(DEFAULT_PROTOCOL + '://' + program.url);
  }
  url_resolved.protocol = url_resolved.protocol.slice(0, -1);
  if (url_resolved.protocol !== 'http' && url_resolved.protocol !== 'https') {
    console.log('[ERROR] : Invalid Protocol URL detected : %s.', url_resolved.protocol);
    process.exit(1);
  }
  nconf.overrides({
    url: {
      protocol: url_resolved.protocol,
      host: url_resolved.hostname || DEFAULT_HOST,
      port: url_resolved.port || DEFAULT_PORT,
      account: url_resolved.auth ? url_resolved.auth.split(':')[0] : DEFAULT_ACCOUNT,
      passwd: url_resolved.auth ? url_resolved.auth.split(':')[1] : DEFAULT_PASSWD
    }
  });
} else if (program.config) {
  if (program.debug) {
    console.log('[DEBUG] : Load config file : %s', program.config);
  }
  if (fs.existsSync(program.config)) {
    nconf.file({
      file: program.config,
      format: {
        stringify: function(obj, options) {
          return yaml.safeDump(obj, options);
        },
        parse: function(obj, options) {
          return yaml.safeLoad(obj, options);
        }
      }
    });
  } else {
    console.log('[ERROR] : Config file : %s not found', program.config);
    process.exit(1);
  }
} else {
  if (!fs.existsSync(path.homedir() + ("/" + CONFIG_DIR))) {
    console.log('[DEBUG] : Default configuration file doesn\'t exist : %s', program.debug ? path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE) : void 0);
    fs.mkdir(path.homedir() + ("/" + CONFIG_DIR), function(err) {
      if (err) {
        return console.log('[ERROR] : %s', err);
      } else {
        nconf.set('url:protocol', DEFAULT_PROTOCOL);
        nconf.set('url:host', DEFAULT_HOST);
        nconf.set('url:port', DEFAULT_PORT);
        nconf.set('url:account', DEFAULT_ACCOUNT);
        nconf.set('url:passwd', DEFAULT_PASSWD);
        console.log('[DEBUG] : Default configuration file created : %s', program.debug ? path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE) : void 0);
        return nconf.save();
      }
    });
  }
  if (program.debug) {
    console.log("[DEBUG] : Default configuration file loaded : ~/" + CONFIG_DIR + "/" + CONFIG_FILE);
  }
  nconf.file({
    file: path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE),
    format: {
      stringify: function(obj, options) {
        return yaml.safeDump(obj, options);
      },
      parse: function(obj, options) {
        return yaml.safeLoad(obj, options);
      }
    }
  });
}

nconf.defaults({
  url: {
    protocol: DEFAULT_PROTOCOL,
    host: DEFAULT_HOST,
    port: DEFAULT_PORT,
    account: DEFAULT_ACCOUNT,
    passwd: DEFAULT_PASSWD
  }
});

if (program.debug) {
  console.log('[DEBUG] : DSM Connection URL configured : %s://%s:%s@%s:%s', nconf.get('url:protocol'), nconf.get('url:account'), nconf.get('url:passwd'), nconf.get('url:host'), nconf.get('url:port'));
}

syno = new Syno({
  protocol: nconf.get('url:protocol'),
  host: nconf.get('url:host'),
  port: nconf.get('url:port'),
  account: nconf.get('url:account'),
  passwd: nconf.get('url:passwd')
});

program.command('filestation <method>').alias('fs').description('DSM File Station API').option('-c, --config <path>', "DSM configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno filestation|fs listSharedFolders');
  console.log('    $ syno filestation|fs listFiles --pretty --payload \'{"folder_path":"/path/to/folder"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : DSM File Station API command selected');
  }
  return execute('fs', cmd, options);
});

program.command('downloadstation <method>').alias('dl').description('DSM Download Station API').option('-c, --config <path>', "DSM configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno downloadstation|dl createTask --payload \'{"uri":"magnet|ed2k|ftp(s)|http(s)://link"}\'');
  console.log('    $ syno downloadstation|dl listTasks');
  console.log('    $ syno downloadstation|dl listTasks --payload \'{"limit":1}\'');
  console.log('    $ syno downloadstation|dl getTasksInfo --pretty --payload \'{"id":"task_id"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : DSM Download Station API command selected');
  }
  return execute('dl', cmd, options);
});

program.command('audiostation <method>').alias('as').description('DSM Audio Station API').option('-c, --config <path>', "DSM configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno audiostation|as listSongs --payload \'{"limit":1}\'');
  console.log('    $ syno audiostation|as listAlbums');
  console.log('    $ syno audiostation|as searchSong --payload \'{"title":"victoria"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : DSM Audio Station API command selected');
  }
  return execute('as', cmd, options);
});

program.command('videostation <method>').alias('vs').description('DSM Video Station API').option('-c, --config <path>', "DSM configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno videostation|vs listMovies --payload \'{"limit":1}\'');
  console.log('    $ syno videostation|vs getTVShowEpisodeInfo --payload \'{"id":"episode_id"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : DSM Video Station API command selected');
  }
  return execute('vs', cmd, options);
});

program.command('videostationdtv <method>').alias('dtv').description('DSM Video Station DTV API').option('-c, --config <path>', "DSM configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', "DSM URL. Default to " + DEFAULT_PROTOCOL + "://" + DEFAULT_ACCOUNT + ":" + DEFAULT_PASSWD + "@" + DEFAULT_HOST + ":" + DEFAULT_PORT).option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno videostationdtv|dtv listDTVChannels --payload \'{"limit":1}\'');
  console.log('    $ syno videostationdtv|dtv getDTVTunerInfo --payload \'{"id":"tuner_id"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : DSM Video Station DTV API command selected');
  }
  return execute('dtv', cmd, options);
});

program.parse(process.argv);
