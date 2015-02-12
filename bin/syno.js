var CONFIG_DIR, CONFIG_FILE, Syno, execute, fs, nconf, os, path, program, syno, url, url_resolved, yaml;

CONFIG_DIR = '.syno';

CONFIG_FILE = 'auth.yaml';

program = require('commander');

fs = require('fs');

url = require('url');

nconf = require('nconf');

path = require('path-extra');

yaml = require('js-yaml');

Syno = require('../dist/syno.js');

os = require('os');

execute = function(api, cmd, options) {
  var exception, payload;
  if (program.debug) {
    console.log("[DEBUG] : Method name : %s", cmd);
  }
  if (options.payload && program.debug) {
    console.log("[DEBUG] : Method payload : %s", options.payload);
  }
  if (options.pretty && program.debug) {
    console.log('[DEBUG] : Prettify output detected');
  }
  try {
    payload = JSON.parse(options.payload || '{}');
  } catch (_error) {
    exception = _error;
    console.log("[ERROR] : JSON Exception : %s", exception);
    process.exit(1);
  }
  return syno[api][cmd](payload, function(err, data) {
    if (err) {
      console.log("[ERROR] : %s", err);
    }
    if (options.pretty) {
      data = JSON.stringify(data, void 0, 2);
    } else {
      data = JSON.stringify(data);
    }
    if (data) {
      console.log(data);
    }
    return process.exit(0);
  });
};

program.version('1.0.1').description('Synology Rest API Command Line').option('-c, --config <path>', "DSM Login Config file. defaults to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', 'DSM Uri - Default : (http://admin:password@localhost:5001)').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Commands:');
  console.log('');
  console.log('    fs|filestation [options] <method>  DSM File Station API');
  console.log('    dl|downloadstation [options] <method>  DSM Download Station API');
  return console.log('');
}).on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno fs getFileStationInfo');
  console.log('    $ syno dl getDownloadStationInfo');
  return console.log('');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
} else if (program.args.length > 0 && program.args[0] !== 'fs' && program.args[0] !== 'dl') {
  console.log('');
  console.log("  [ERROR] : " + program.args[0] + " is not a valid command !");
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno fs <method> DSM File Station API');
  console.log('    $ syno dl <method> DSM Download Station API');
  console.log('');
  process.exit(1);
}

nconf.argv.env;

if (program.url) {
  if (program.debug) {
    console.log("[DEBUG] : Url detected : %s.", program.url);
  }
  url_resolved = url.parse(program.url);
  nconf.overrides({
    auth: {
      protocol: url_resolved.protocol.slice(0, -1),
      host: url_resolved.hostname,
      port: url_resolved.port,
      account: url_resolved.auth.split(':')[0],
      passwd: url_resolved.auth.split(':')[1]
    }
  });
} else if (program.config) {
  if (program.debug) {
    console.log("[DEBUG] : Load config file : %s.", program.config);
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
    console.log("[ERROR] : Config file : %s not found.", program.config);
    process.exit(1);
  }
} else {
  if (program.debug) {
    console.log("[DEBUG] : Load default config file : ~/" + CONFIG_DIR + "/auth.yaml.");
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
  auth: {
    protocol: 'http',
    host: 'localhost',
    port: 5001,
    account: 'admin',
    passwd: 'password'
  }
});

if (!fs.existsSync(path.homedir() + ("/" + CONFIG_DIR))) {
  if (program.debug) {
    console.log("[DEBUG] : %s doesn't exist", path.homedir() + ("/" + CONFIG_DIR));
  }
  fs.mkdir(path.homedir() + ("/" + CONFIG_DIR), function(err) {
    if (err) {
      return console.log(err);
    } else {
      nconf.set('auth:protocol', 'http');
      nconf.set('auth:host', 'localhost');
      nconf.set('auth:port', 5001);
      nconf.set('auth:account', 'admin');
      nconf.set('auth:passwd', 'password');
      if (program.debug) {
        console.log("[DEBUG] : Save default config file to : %s", path.homedir() + ("/" + CONFIG_DIR));
      }
      return nconf.save();
    }
  });
}

syno = new Syno({
  protocol: nconf.get('auth:protocol'),
  host: nconf.get('auth:host'),
  port: nconf.get('auth:port'),
  account: nconf.get('auth:account'),
  passwd: nconf.get('auth:passwd')
});

program.command('fs <method>').alias('filestation').description('DSM File Station API').option('-c, --config <path>', "DSM Login Config file. defaults to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', 'DSM Uri - Default : (http://admin:password@localhost:5001)').option("-p, --payload <payload>", "JSON Payload").option('-P, --pretty', 'Pretty print JSON output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno fs listSharedFolders');
  console.log('    $ syno fs listFiles --pretty --payload \'{"folder_path":"/path/to/folder"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log("[DEBUG] : DSM File Station API selected");
  }
  return execute('fs', cmd, options);
});

program.command('dl <method>').alias('downloadstation').description('DSM Download Station API').option('-c, --config <path>', "DSM Login Config file. defaults to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-u, --url <url>', 'DSM Uri - Default : (http://admin:password@localhost:5001)').option("-p, --payload <payload>", "JSON Payload").option('-P, --pretty', 'Pretty print JSON output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ syno dl listTasks');
  console.log('    $ syno dl listTasks --payload \'{"limit":1}\'');
  console.log('    $ syno dl getTasksInfo --pretty --payload \'{"id":"task_id"}\'');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log("[DEBUG] : DSM Download Station API selected");
  }
  return execute('dl', cmd, options);
});

program.parse(process.argv);