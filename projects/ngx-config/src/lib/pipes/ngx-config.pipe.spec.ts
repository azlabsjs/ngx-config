import { JSObject } from '@azlabsjs/js-object';
import { ConfigurationManager } from '../contracts';
import { NgxConfigPipe } from './ngx-config.pipe';

function configurationManager() {
  let environment = {
    api: {
      host: 'http://127.0.0.1:8000',
      credentials: {
        user: 'user',
      },
    },
  };
  return {
    load(configuration?: { [index: string]: unknown }) {
      environment = { ...environment, ...configuration };
    },

    // Cette method récupère une valeur correspodante à la clé fourni
    get<T = unknown>(key?: string, d?: T | unknown) {
      return JSObject.getProperty(environment, key ?? '') ?? (d as T);
    },
  } as ConfigurationManager;
}

describe('NgxConfigPipe', () => {
  it('create an instance', () => {
    const pipe = new NgxConfigPipe(configurationManager());
    expect(pipe).toBeTruthy();
  });

  it('returns 127.0.0.1:8000 when api.host is passed as parameter', () => {
    const pipe = new NgxConfigPipe(configurationManager());
    expect(pipe.transform('api.host')).toEqual('http://127.0.0.1:8000');
  });

  it('returns default value if key is not found', () => {
    const pipe = new NgxConfigPipe(configurationManager());
    expect(pipe.transform('api.host.credentials.password', 'password')).toEqual(
      'password'
    );
  });

  it('returns an empty string if not configuration key matches', () => {
    const pipe = new NgxConfigPipe(configurationManager());
    expect(pipe.transform('api.host.credentials.password')).toEqual(undefined);
  });
});
