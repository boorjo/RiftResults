import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { TOKEN_SERVICIOSTORAGE } from './servicios/injectiontokenstorageservice';
import { SignalstorageService } from './servicios/signalstorage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(),
    {provide: TOKEN_SERVICIOSTORAGE, useClass: SignalstorageService}
  ]
};

