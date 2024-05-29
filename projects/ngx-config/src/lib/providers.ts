import { APP_INITIALIZER, Provider } from '@angular/core';
import {
  CallableConfigLoader,
  ConfigMap,
  ConfigurationManager,
  JSONConfigLoader,
} from './contracts';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  AppConfigurationManager,
  AppEnvironmentManager,
  JSON_CONFIG_LOADER,
} from './services';

/** @internal */
export const appInitialization = (manager: ConfigurationManager) => async () =>
  await manager.load();

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
  url = '/assets/resources/config.json',
  loader?: CallableConfigLoader
) {
  return {
    provide: APP_CONFIG_MANAGER,
    useFactory: (e: ConfigurationManager, l?: JSONConfigLoader) => {
      return new AppConfigurationManager(
        url ?? '/assets/resources/config.json',
        e,
        loader ?? l
      );
    },
    deps: [ANGULAR_ENVIRONMENT_MANAGER, JSON_CONFIG_LOADER],
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
    useFactory: (manager: ConfigurationManager) => appInitialization(manager),
    multi: true,
    deps: [APP_CONFIG_MANAGER],
  } as Provider;
}
