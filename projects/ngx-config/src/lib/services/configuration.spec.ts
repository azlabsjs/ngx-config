import { TestBed } from '@angular/core/testing';
import { ConfigurationManager } from '../contracts';
import { AppConfigurationManager } from './configuration';
import { AppEnvironmentManager } from './environment';
import {
  ANGULAR_ENVIRONMENT_MANAGER,
  APP_CONFIG_MANAGER,
  ENVIRONMENT,
  JSON_CONFIG_LOADER,
} from './tokens';

describe('App configuration manager Tests', () => {
  let service: ConfigurationManager;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: APP_CONFIG_MANAGER,
          useClass: AppConfigurationManager,
        },
        {
          provide: ANGULAR_ENVIRONMENT_MANAGER,
          useClass: AppEnvironmentManager,
        },
        {
          provide: ENVIRONMENT,
          useValue: {
            production: false,
            api: {
              host: 'https://localhost',
            },
          },
        },
        {
          provide: JSON_CONFIG_LOADER,
          useValue: (url: string) =>
            url !== 'api/prod'
              ? {
                  api: {
                    host: 'http://127.0.0.1',
                  },
                }
              : {
                  production: true,
                  api: {
                    host: 'http://prod.server.org',
                  },
                },
        },
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
