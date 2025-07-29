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
  Briefcase,
  Edit,
  GitPullRequest,
  LogIn,
  Plus,
  Search,
  Share2,
  Star,
  Trash2,
  User,
  Users,
  UserX,
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
  GitPullRequest,
  Plus,
  Share2,
  Briefcase,
  LogIn,
  UserX,
  Search,
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
