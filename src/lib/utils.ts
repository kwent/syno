import pluralize from 'pluralize';

export function underscoreToCamelize(str: string): string {
  str = str.replace(/_([a-z])/g, (_match, letter: string) => letter.toUpperCase());
  return str.substring(0, 1).toLowerCase() + str.slice(1);
}

export function trimSyno(str: string): string {
  str = str.replace(/SYNO\./, '');
  return str.replace(/\./g, '');
}

export function trimSynoNamespace(str: string): string {
  return str.split('.')[1] || '';
}

const fixCamelCaseWords = [
  'ack', 'add', 'apply', 'archive', 'arrange', 'audio', 'auth',
  'bat', 'break', 'cam', 'card', 'category', 'check', 'chk', 'clear',
  'close', 'compare', 'config', 'control', 'copy', 'count', 'create',
  'delete', 'del', 'disabled', 'disable', 'door', 'download', 'edit',
  'eject', 'enable', 'enabled', 'enum', 'event', 'export', 'force',
  'format', 'get', 'go', 'holder', 'imported', 'import', 'info', 'io',
  'keep', 'list', 'live', 'load', 'unlock', 'lock', 'log', 'mark', 'md',
  'migration', 'modify', 'module', 'monitor', 'motion', 'notify', 'ntp',
  'open', 'unpair', 'pair', 'play', 'poll', 'polling', 'query', 'quick',
  'record', 'rec', 'recount', 'redirect', 'remove', 'resync', 'retrieve', 'roi',
  'run', 'save', 'search', 'selected', 'select', 'send', 'server', 'set',
  'setting', 'share', 'snapshot', 'start', 'stop', 'stream', 'sync',
  'test', 'trigger', 'updated', 'update', 'upload',
  'verify', 'view', 'volume',
];

export function fixCamelCase(str: string): string {
  for (let idx = 0; idx < fixCamelCaseWords.length; idx++) {
    const word = fixCamelCaseWords[idx];
    str = str.replace(new RegExp(word + '.', 'i'), (match) => {
      const matchLower = match.slice(0, -1).toLowerCase();
      const precedingWords = fixCamelCaseWords.slice(0, idx);
      if (!precedingWords.some((el) => el.indexOf(matchLower) >= 0)) {
        return (
          match.charAt(0).toUpperCase() +
          match.slice(1, -1) +
          match.charAt(match.length - 1).toUpperCase()
        );
      }
      return match;
    });
  }
  return str;
}

export function deletePattern(str: string, pattern: string): string {
  const regex = new RegExp(pattern, 'i');
  return str.replace(regex, '');
}

export function listPluralize(method: string, apiSubName: string): string {
  if (method.toLowerCase().startsWith('list') && !apiSubName.endsWith('s')) {
    apiSubName = apiSubName.replace(/([A-Z][^A-Z]+)$/, (_, last: string) => pluralize(last));
  }
  return apiSubName;
}

function camelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr: string) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

export function createFunctionName(apiName: string, method: string): string {
  const nameSpace = trimSynoNamespace(apiName);
  let trimmedApi = trimSyno(apiName);
  trimmedApi = deletePattern(trimmedApi, nameSpace);
  trimmedApi = deletePattern(trimmedApi, method);
  method = deletePattern(method, trimmedApi);
  method = fixCamelCase(method);
  trimmedApi = listPluralize(method, trimmedApi);
  const functionName = `${method}${trimmedApi}`;
  return camelCase(functionName);
}
