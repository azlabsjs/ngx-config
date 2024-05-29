import { TestBed } from '@angular/core/testing';
import { ConfigurationManager } from '../contracts';
import { APP_CONFIG_MANAGER } from './tokens';
import {
  provideConfigurationManager,
  provideNgEnvironment,
} from './providers';

describe('App configuration manager Tests', () => {
  let service: ConfigurationManager;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideNgEnvironment({
          production: false,
          api: {
            host: 'https://localhost',
          },
        }),
        provideConfigurationManager({
          loader: (url?: string) =>
            new Promise((resolve) =>
              url !== 'api/prod'
                ? resolve({ api: { host: 'http://127.0.0.1' } })
                : resolve({
                    production: true,
                    api: { host: 'http://prod.server.org' },
                  })
            ),
        }),
      ],
    }).compileComponents();
    service = TestBed.inject(APP_CONFIG_MANAGER);
  });

  it('It should returns http://127.0.0.1 when request for api.host configuration key ', async () => {
    await service.load();
    expect(service.get('api.host')).toEqual('http://127.0.0.1');
  });

  it('It should returns http://prod.server.org when request for api.host configuration key ', async () => {
    await service.load('api/prod');
    expect(service.get('api.host')).toEqual('http://prod.server.org');
  });

  it('It should return the whole configuration if no key is provided', async () => {
    await service.load('api/prod');
    expect(service.get()).toEqual({
      production: true,
      api: {
        host: 'http://prod.server.org',
      },
    });
  });
});
