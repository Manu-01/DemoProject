import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'menu', pathMatch: 'full' },
    {
        path: 'menu',
        loadChildren: () => import('./modules/menu/menu.module').then((m) => m.MenuModule),
    },
    {
        path: 'org',
        loadChildren: () => import('./modules/org/org.module').then((m) => m.OrgModule),
    }

];
