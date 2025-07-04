import { Inject, Injectable, Optional } from '@angular/core';
import { getObjectProperty } from '@azlabsjs/js-object';
import {
  ConfigMap,
  ConfigurationManager,
  JSONConfigLoader,
  ConfigLoader,
  UnknownType,
} from '../contracts';
import { deepMerge, isPureFunction } from '../internals';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  JSON_CONFIG_LOADER,
  JSON_CONFIG_URL,
} from './tokens';

@Injectable()
export class AppConfigurationManager implements ConfigurationManager {
  private environment: ConfigMap = {};
  private configurations: ConfigMap = {};

  constructor(
    @Inject(JSON_CONFIG_URL) @Optional() private url?: string,
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
    const { environment, configLoader, url: _url } = this;
    if (!configLoader) {
      this.configurations = environment;
      return;
    }
    try {
      const _loader = isPureFunction(configLoader)
        ? configLoader
        : (p?: string) => {
            return (configLoader as ConfigLoader).get(p);
          };
      this.configurations = deepMerge(environment, await _loader(url ?? _url));
    } catch (error) {
      this.configurations = environment;
    }
  }

  get<T = UnknownType>(key?: string, d?: T | unknown) {
    if (key) {
      return (getObjectProperty(this.configurations, key) ??
        d ??
        undefined) as T;
    }
    return (this.configurations ?? {}) as T;
  }
}
