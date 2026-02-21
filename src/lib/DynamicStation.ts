import type { DefinitionsMap, MethodInfo } from '../types.js';
import { createFunctionName } from './utils.js';
import { getMethodsForApi } from './DefinitionLoader.js';
import type { AuthenticatedAPI } from './AuthenticatedAPI.js';

export function buildMethodMap(
  definitions: DefinitionsMap,
  apiPrefixes: string[],
  sessionName: string,
): Map<string, MethodInfo> {
  const map = new Map<string, MethodInfo>();

  for (const prefix of apiPrefixes) {
    const apiKeys = Object.keys(definitions).filter((key) => key.startsWith(prefix));

    for (const apiKey of apiKeys) {
      const definition = definitions[apiKey];
      if (!definition.methods) continue;

      const methods = getMethodsForApi(definition);
      const apiPath = definition.path || 'entry.cgi';
      const version = definition.maxVersion || 1;

      for (const method of methods) {
        const functionName = createFunctionName(apiKey, method);
        map.set(functionName, {
          api: apiKey,
          version: String(version),
          path: apiPath,
          method,
          sessionName,
        });
      }
    }
  }

  return map;
}

export function createProxiedStation<T extends AuthenticatedAPI>(
  station: T,
  methodMap: Map<string, MethodInfo>,
): T {
  return new Proxy(station, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && methodMap.has(prop)) {
        const info = methodMap.get(prop)!;
        return (params?: Record<string, unknown>) => {
          return target.requestAPI({
            apiInfos: info,
            params,
          });
        };
      }
      return Reflect.get(target, prop, receiver);
    },
    has(target, prop) {
      if (typeof prop === 'string' && methodMap.has(prop)) {
        return true;
      }
      return Reflect.has(target, prop);
    },
  });
}
