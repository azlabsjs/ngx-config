import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ConfigurationManager } from '../contracts';
import { APP_CONFIG_MANAGER } from '../services';

@Pipe({
  name: 'ngxConfig',
})
export class NgxConfigPipe implements PipeTransform {

  /**
   * Creates an instance of the NgxConfigPipe
   *
   * @param configManager
   */
  constructor(@Inject(APP_CONFIG_MANAGER) private configManager: ConfigurationManager) {}

  transform(value: string, default_?: any): unknown {
    return this.configManager.get(value, default_) ?? '';
  }
}
