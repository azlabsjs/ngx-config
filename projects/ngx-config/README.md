# NgxConfig

NgxConfig provides a useful abstraction arround angular environment management by adding a layer that allows developpers to load configuration that may change, when deploying in various environments, or during application runtime (a.k.a when deployed in prod).

## Dependencies

They library is dependent on Angular core and common, crypto-es the [https://github.com/azlabsjs/secure-web-storage/packages/1266504] a.k.a secure-web-storage libraries.

| @azlabsjs/ngx-storage | Angular |
|-----------------------|---------|
| ^0.13.x               | ^13.x   |
|-----------------------|---------|
| ^0.14.x               | ^14.3   |

## Usage

Following angular best practices, the library offers it services and components using an angular module. To use the library services, import the main module into your `app.module.ts` file as follow:

```ts
// app.module.ts
import { NgModule } from '@angular/core';
import { NgxConfigModule } from '@azlabsjs/ngx-config';
import {environment} from 'src/environments/environment';

@NgModule({
 // declarations, providers, etc...
 imports: [
   // Other modules
    NgxConfigModule.forRoot({
      environment: environment, // The angular enviroment values to fallback to if not JSON configuration are provided
      jsonConfigURL: '<URL_To_Webservice_or_JSON_ASSETS>', // Optional
      jsonLoader: {
        factory: () => {
          // Load json configuration and return an instance of {@see JSONConfigLoader} type
        }; // Provider factory function
        deps: any[]; // Provider 
      },  // A Service provider configuration to override the default JSON loader
   })
 ]
})
export class AppModule {}
```

- How to use the provided services ?

The NgxConfig library provides a Service class for loading configuration values from in-memory environment:

```ts
// my-component.ts
import { Component } from '@angular/core';
import { ConfigurationManager, APP_CONFIG_MANAGER} from '@azlabsjs/ngx-config';

@Component({
  selector: 'app-my-component',
  template: 
})
export class MyComponent {

  // Initialize component property with value from configuration
  private apiEndpoint = this.config.get<string>('api.host'); // Returns a string value pointing to the endpoint API

  constructor(@Inject(APP_CONFIG_MANAGER) private config: ConfigurationManager) {}
}
```
