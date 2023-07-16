import { InjectionToken } from "@angular/core";
import { ConfigurationManager, JSONConfigLoader } from "../contracts";

export const ENVIRONMENT = new InjectionToken<{ [index: string]: unknown }>(
  'Angular enviromenent injection token'
);

// Permet d'injecter les types dans le gestionnaire des dépendances
// Tout ce qui est type : Interface, ou tout type dy langage Typescript (number, string, { [index: string]: any })
export const ANGULAR_ENVIRONMENT_MANAGER = new InjectionToken<ConfigurationManager>(
  'EnvironmentManager injection token'
);

export const APP_CONFIG_MANAGER  = new InjectionToken<ConfigurationManager>(
  'Injectable instance of configuration manager'
);

export const JSON_CONFIG_URL =new InjectionToken<string>(
  'JSON configuration file path'
);

export const JSON_CONFIG_LOADER  = new InjectionToken<JSONConfigLoader>(
  'JSON Configuration Loader class'
);
