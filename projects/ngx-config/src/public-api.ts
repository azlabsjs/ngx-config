/*
 * Public API Surface of ngx-config
 */
export { NgxConfigModule } from './lib/ngx-config.module';
export { ConfigurationManager, JSONConfigLoader } from './lib/contracts';
export {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  ENVIRONMENT,
  JSON_CONFIG_URL,
  JSON_CONFIG_LOADER,
  AppConfigurationManager,
} from './lib/services';
export { NgxConfigPipe } from './lib/pipes';
