import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { first } from 'rxjs';
import { AppService } from './app.service';
import { filter } from 'rxjs/operators';
import DevExpress from 'devextreme';
import { SINECTROUTES } from './app-routing.module';
import { ToastComponent } from 'libs/ideenherd-library/src/lib/toast/toast.component';
import { DataService } from '@ideenherd/core/data';
@Component({
  selector: 'ideenherd-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  @ViewChild('toast', { static: false }) toast: ToastComponent;
  public contextMenuPosition: DevExpress.PositionConfig = { at: 'right top', my: 'right bottom' };
  public logo: SafeResourceUrl;
  public title = 'si-nect';
  public contextMenuItems = [
    {
      text: 'Logout',
      icon: 'assets/images/bar-code.svg',
      onClick: () => {
        localStorage.removeItem('eventCode');
        this.appService.clearData();
        this.router.navigate([this.dataService.tenant]);
      },
    },
  ];
  constructor(
    public appService: AppService,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private router: Router
  ) { }
  ngOnInit(): void {
    this.redirectWhenReload();

    this.appService.accreditationConfigLoaded.pipe(first()).subscribe(() => {
      this.logo = this.appService.accreditationConfig.logo
        ? this.domSanitizer.bypassSecurityTrustResourceUrl(`data:image/svg+xml;base64,${this.appService.accreditationConfig.logo}`)
        : null;
    });
    this.appService.notification$.subscribe((notification) => {
      this.toast.showNotification(notification);
    })
  }
  redirectWhenReload() {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe((event) => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          this.appService.clearData();
          this.dataService.tenant=localStorage.getItem('tenant');

          this.router.navigate([this.dataService.tenant], { queryParamsHandling: 'preserve' });
        }
      });
  }
  public returnButton(): void {
    this.appService.callBackButton();
  }
  public goToHome(): void {
    this.router.navigateByUrl(SINECTROUTES.EVENT_DETAIL);
  }
}
