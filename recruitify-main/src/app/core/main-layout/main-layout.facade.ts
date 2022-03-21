import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { paths } from 'src/app/app-routing.constants';

@Injectable()
export class MainLayoutFacade {
  isHeaderVisible = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isHeaderVisible =
          event.url !== `/${paths.login}` &&
          event.url !== `/${paths.start}` &&
          event.url !== `/${paths.internships}` &&
          !event.url.includes(paths.fillForm) &&
          event.url !== `/${paths.finish}`;
      });
  }
}
