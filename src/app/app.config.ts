import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  AlertTriangle,
  AlignRight,
  Bell,
  Delete,
  Edit,
  GitPullRequest,
  Star,
  Trash2,
  User,
  Users,
} from 'angular-feather/icons';
const icons = {
  Bell,
  User,
  Star,
  AlignRight,
  AlertTriangle,
  Users,
Trash2,
  Edit,
  GitPullRequest
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(FeatherModule.pick(icons)),
    // importProvidersFrom(ModuleRegistry.registerModules([AllCommunityModule]))
  ],
};
