import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { ICONS } from './shared/modules/nz-icons-module';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { requestInterceptor } from './core/interceptors/request-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([requestInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzIcons(ICONS),
    provideNzI18n(en_US),
    provideAnimations(),
  ]
};
