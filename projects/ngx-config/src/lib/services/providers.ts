import { APP_INITIALIZER, Provider, inject } from '@angular/core';
import {
  CallableConfigLoader,
  ConfigMap,
  ConfigurationManager,
  JSONConfigLoader,
} from '../contracts';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  JSON_CONFIG_LOADER,
} from './tokens';
import { AppEnvironmentManager } from './environment';
import { AppConfigurationManager } from './configuration';

/** @internal */
export const appInitialization =
  (manager: ConfigurationManager | null) => async () =>
    await manager?.load();

/** @description Provides a configuration manager instance angular environment object */
export function provideNgEnvironment(e: ConfigMap) {
  return {
    provide: ANGULAR_ENVIRONMENT_MANAGER,
    useFactory: () => {
      return new AppEnvironmentManager(e);
    },
  } as Provider;
}

/** @descripte Provides a configuration manager that merge configuration defines in a remote or json asset and angular environment object */
export function provideConfigurationManager(
  config?: Partial<{
    url: string;
    loader: CallableConfigLoader;
  }>
) {
  const { url, loader } = config ?? {};
  return {
    provide: APP_CONFIG_MANAGER,
    useFactory: () => {
      return new AppConfigurationManager(
        url ?? '/assets/resources/config.json',
        inject(ANGULAR_ENVIRONMENT_MANAGER),
        loader ?? inject(JSON_CONFIG_LOADER)
      );
    },
    deps: [],
  } as Provider;
}

/** @description Provides a service that query for configuration values from a json assets (either remote or local) */
export function provideJsonConfigLoader(config: {
  factory: (...deps: unknown[]) => JSONConfigLoader;
  deps?: unknown[];
}) {
  const { factory, deps } = config;
  return {
    provide: JSON_CONFIG_LOADER,
    useFactory: factory,
    deps,
  } as Provider;
}

/** @decription Provides a factory function that executes when angular application runs initialization functions */
export function provideAppInitializers() {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => appInitialization(inject(APP_CONFIG_MANAGER)),
    multi: true,
    deps: [],
  } as Provider;
}
