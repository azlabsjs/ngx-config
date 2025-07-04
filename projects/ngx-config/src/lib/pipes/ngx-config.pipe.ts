import { Inject, Pipe, PipeTransform } from '@angular/core';
import { ConfigurationManager } from '../contracts';
import { APP_CONFIG_MANAGER } from '../services';

@Pipe({
  standalone: true,
  name: 'ngxConfig',
  pure: true,
})
export class NgxConfigPipe implements PipeTransform {
  /**
   * Creates an instance of the NgxConfigPipe
   *
   * @param configManager
   */
  constructor(
    @Inject(APP_CONFIG_MANAGER) private configManager: ConfigurationManager
  ) {}

  transform<T>(value: string, d?: unknown) {
    return this.configManager.get<T>(value, d as T);
  }
}
