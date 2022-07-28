import { Observable } from 'rxjs';

// @internal
export type ConfigMap = { [index: string]: any };

// @internal
export type CallableConfigLoader = (path?: string) => Promise<ConfigMap>;

// @internal
export interface ConfigLoader {

  /**
   * Returns a JSON decoded configuration object
   *
   * @example
   * class HTTPLoader implements ConfigLoader {
   *
   *  public constructor(private client: HttpClient) {}
   *
   *  public get(path: string) {
   *    return lastValueFrom(this.client.get(url).pipe(
   *      catchError(err => {
   *        return of({});
   *      })
   *    ));
   *  }
   * }
   *
   *
   * @param path Path to the JSON configuration resource
   */
  get(path?: string): Promise<ConfigMap>;
}


export interface ConfigurationManager {
  // Cette method charge en mémoire les configurations de l'application
  load(
    configuration?: { [index: string]: any } | string
  ): void | Observable<any> | Promise<any>;

  // Cette method récupère une valeur correspodante à la clé fourni
  get<T = unknown>(key?: string, default_?: any): T;
}

export type JSONConfigLoader = CallableConfigLoader | ConfigLoader;
