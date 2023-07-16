import { TestBed } from '@angular/core/testing';
import { ConfigurationManager } from '../contracts';
import { AppEnvironmentManager } from './environment';
import { ANGULAR_ENVIRONMENT_MANAGER, ENVIRONMENT } from './tokens';

describe('App configuration manager Tests', () => {
  let service: ConfigurationManager;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
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
      ],
    }).compileComponents();
    service = TestBed.inject(ANGULAR_ENVIRONMENT_MANAGER);
  });

  it('It should returns https://localhost when request for api.host configuration key ', async () => {
    await service.load();
    expect(service.get('api.host')).toEqual('https://localhost');
  });

  it('It should return the whole configuration if no key is provided', async () => {
    await service.load();
    expect(service.get()).toEqual({
        production: false,
        api: {
          host: 'https://localhost',
        },
      });
  });
});
