import { Observable } from 'rxjs';

// @internal
export type ConfigMap = { [index: string]: unknown };

// @internal
export type CallableConfigLoader = (path?: string) => Promise<ConfigMap>;

/** @internal */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownType = any;

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
  // cette method charge en mémoire les configurations de l'application
  load(
    configuration?: { [index: string]: unknown } | string
  ): void | Observable<void> | Promise<void>;

  // cette method récupère une valeur correspodante à la clé fourni
  get<T = UnknownType>(key?: string, d?: T | unknown): T | undefined | null;
}

export type JSONConfigLoader = CallableConfigLoader | ConfigLoader;
