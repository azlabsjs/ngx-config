import { Inject, Injectable, Optional } from '@angular/core';
import { getObjectProperty } from '@azlabsjs/js-object';
import {
  ConfigMap,
  ConfigurationManager,
  JSONConfigLoader,
  CallableConfigLoader,
  ConfigLoader,
} from '../contracts';
import { isPureFunction } from '../internals';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  JSON_CONFIG_LOADER,
  JSON_CONFIG_URL,
} from './tokens';

/**
 * Merge properties of the source object into the target object 
 */
function deepMerge<T extends { [key: string]: unknown }>(
  target: T,
  source: T | Partial<T>
) {
  const isObject = (obj: unknown) => obj && typeof obj === 'object';

  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  // Initialiaze output object
  const output: any = {} as T;

  for (const key in source) {
    const tValue = target[key];
    const sValue = source[key];
    if (Array.isArray(tValue) && Array.isArray(sValue)) {
      output[key] = [...tValue].concat(sValue);
      continue;
    }
    if (isObject(tValue) && isObject(sValue)) {
      output[key] = deepMerge(Object.assign({}, tValue), sValue as any);
      continue;
    }

    output[key] = sValue;
  }

  // return the constructed merged object
  return output as T;
}

@Injectable({
  providedIn: 'root',
})
export class AppConfigurationManager implements ConfigurationManager {
  private environment: ConfigMap = {};
  private configurations: ConfigMap = {};

  constructor(
    @Inject(JSON_CONFIG_URL) @Optional() private url: string,
    @Inject(ANGULAR_ENVIRONMENT_MANAGER)
    @Optional()
    ngEnviroment?: ConfigurationManager,
    @Inject(JSON_CONFIG_LOADER)
    @Optional()
    private configLoader?: JSONConfigLoader
  ) {
    this.environment = ngEnviroment?.get() ?? {};
  }

  async load(url?: string) {
    if (
      typeof this.configLoader === 'undefined' ||
      this.configLoader === null
    ) {
      this.configurations = this.environment ?? {};
      return;
    }
    try {
      const configurations = await (isPureFunction(this.configLoader)
        ? (this.configLoader as CallableConfigLoader)(url ?? this.url)
        : (this.configLoader as ConfigLoader).get(url ?? this.url));

      // Deep merge environment and loaded configuration
      this.configurations = deepMerge(
        this.environment ?? {},
        configurations ?? {}
      );
    } catch (error) {
      this.configurations = this.environment ?? {};
    }
  }

  get(key: string | undefined = undefined, default_: any = undefined) {
    if (key) {
      return (
        getObjectProperty(this.configurations ?? {}, key) ??
        default_ ??
        undefined
      );
    }
    return this.configurations ?? {};
  }
}
