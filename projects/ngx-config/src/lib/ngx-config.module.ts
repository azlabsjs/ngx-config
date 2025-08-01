import {
  NgModule,
  ModuleWithProviders,
  Provider,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  ENVIRONMENT,
  JSON_CONFIG_URL,
  JSON_CONFIG_LOADER,
  AppEnvironmentManager,
  AppConfigurationManager,
} from './services';
import { ConfigurationManager, JSONConfigLoader } from './contracts';
import { NgxConfigPipe } from './pipes';

export const appInitialization = (manager: ConfigurationManager) => async () =>
  await manager.load();

interface ModuleConfig {
  environment: { [index: string]: unknown };
  jsonConfigURL?: string;
  jsonLoader?: {
    factory: (...deps: unknown[]) => JSONConfigLoader;
    deps: unknown[];
  };
}

@NgModule({
  imports: [NgxConfigPipe],
  exports: [NgxConfigPipe],
})
export class NgxConfigModule {
  /** @deprecated Use exposed providers instead */
  static forRoot(config: ModuleConfig): ModuleWithProviders<NgxConfigModule> {
    const providers: Provider[] = [
      {
        provide: ENVIRONMENT,
        useValue: config.environment,
      },
      {
        provide: JSON_CONFIG_URL,
        useValue: config.jsonConfigURL ?? '/assets/resources/config.json',
      },
      AppEnvironmentManager,
      AppConfigurationManager,
      {
        provide: ANGULAR_ENVIRONMENT_MANAGER,
        useClass: AppEnvironmentManager,
      },
      {
        provide: APP_CONFIG_MANAGER,
        useClass: AppConfigurationManager,
      },
      {
        provide: APP_INITIALIZER,
        useFactory: () => appInitialization(inject(APP_CONFIG_MANAGER)),
        multi: true,
        deps: [],
      },
    ];

    if (config.jsonLoader) {
      providers.push({
        provide: JSON_CONFIG_LOADER,
        useFactory: config.jsonLoader.factory,
        deps: config.jsonLoader.deps,
      });
    }
    return {
      ngModule: NgxConfigModule,
      providers,
    };
  }
}
