import {
  NgModule,
  APP_INITIALIZER,
  ModuleWithProviders,
  Provider,
} from '@angular/core';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  ENVIRONMENT,
  JSON_CONFIG_URL,
  JSON_CONFIG_LOADER,
  AppEnvironmentManager,
  AppConfigurationManager
} from './services';
import { ConfigurationManager, JSONConfigLoader } from './contracts';
import { NgxConfigPipe } from './pipes';

export const appInitialization = (manager: ConfigurationManager) => async () =>
  (await manager.load()) as Promise<any>;

interface ModuleConfig {
  environment: { [index: string]: any };
  jsonConfigURL?: string;
  jsonLoader: {
    factory: (...deps: any[]) => JSONConfigLoader;
    deps: any[];
  };
}

@NgModule({
  declarations: [NgxConfigPipe],
  exports: [NgxConfigPipe],
})
export class NgxConfigModule {
  static forRoot(config: ModuleConfig): ModuleWithProviders<NgxConfigModule> {
    const providers: Provider[] = [
      {
        provide: ANGULAR_ENVIRONMENT_MANAGER,
        useClass: AppEnvironmentManager,
      },
      {
        provide: APP_CONFIG_MANAGER,
        useClass: AppConfigurationManager,
      },
      {
        provide: ENVIRONMENT,
        useValue: config.environment,
      },
      {
        provide: JSON_CONFIG_URL,
        useValue: config.jsonConfigURL ?? '/assets/resources/config.json',
      },
      {
        provide: APP_INITIALIZER,
        useFactory: (manager: ConfigurationManager) =>
          appInitialization(manager),
        multi: true,
        deps: [APP_CONFIG_MANAGER],
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
