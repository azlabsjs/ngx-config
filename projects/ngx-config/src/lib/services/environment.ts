import { Inject, Injectable, Optional } from '@angular/core';
import { getObjectProperty } from '@azlabsjs/js-object';
import { ConfigMap, ConfigurationManager, UnknownType } from '../contracts';
import { ENVIRONMENT } from './tokens';
import { deepMerge } from '../internals';

@Injectable()
export class AppEnvironmentManager implements ConfigurationManager {
  constructor(
    @Inject(ENVIRONMENT) @Optional() private configuration: ConfigMap = {}
  ) {}

  load(configuration?: { [index: string]: unknown }): void {
    this.configuration = deepMerge(
      this.configuration ?? {},
      configuration ?? {}
    );
  }

  get<T = UnknownType>(
    key: string | undefined = undefined,
    d: T | unknown = undefined
  ) {
    if (key) {
      return (getObjectProperty(this.configuration ?? {}, key) ??
        d ??
        undefined) as T;
    }
    return (this.configuration ?? {}) as T;
  }
}
