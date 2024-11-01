import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
@Component({
  selector: 'ideenherd-car-overview',
  templateUrl: './car-overview.component.html',
  styleUrls: ['./car-overview.component.scss'],
})
export class CarOverviewComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  constructor(
    private router: Router,
    public appService: AppService,
  ) { }
  ngOnInit(): void {
    this.appService.showBackButton = true;
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToOrderList();
        });
      }
      this.backToOrderList();
    }));
  }
  private backToOrderList = (): void => {
    this.router.navigateByUrl(SINECTROUTES.EVENT_DETAIL);
  }
  getCarScanner() {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.CAR_OVERVIEW),
    ]);
  }
  getCarDetail(e) {
    this.appService.currentDriverlist = [];
    this.appService.carDetail = this.appService.carList[e.itemIndex];
    this.router.navigate(['/car-detail']);
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
