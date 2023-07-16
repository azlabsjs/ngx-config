import { Inject, Injectable, Optional } from '@angular/core';
import { getObjectProperty } from '@azlabsjs/js-object';
import { ConfigMap, ConfigurationManager } from '../contracts';
import { ENVIRONMENT } from './tokens';
import { deepMerge } from '../internals';

@Injectable({
  providedIn: 'root',
})
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

  get(key: string | undefined = undefined, default_: unknown = undefined) {
    if (key) {
      return (
        getObjectProperty(this.configuration ?? {}, key) ??
        default_ ??
        undefined
      );
    }
    return this.configuration ?? {};
  }
}
