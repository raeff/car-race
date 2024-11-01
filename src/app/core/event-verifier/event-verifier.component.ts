import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Accreditation, AccreditationConfig, Car, EventCode } from '@ideenherd';
import { DataService } from '@ideenherd/core/data';
import { first, map, Subscription, switchMap } from 'rxjs';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
import { AccreditationConfigViewModel } from '../view-models/accreditation-config.view-model';
import { CarViewModel } from '../view-models/car.view-model';
import { EventViewModel } from '../view-models/event.view-model';
import { IToast, ToastType } from '@ideenherd';
@Component({
  selector: 'ideenherd-event-verifier',
  templateUrl: './event-verifier.component.html',
  styleUrls: ['./event-verifier.component.scss'],
})
export class EventVerifierComponent implements OnInit {
  public showSplash = true;
  public eventCode: string;
  private subscriptions: Subscription[] = [];
  public carList: CarViewModel[] = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private appService: AppService,
  ) { }
  ngOnInit(): void {
    this.dataService.tenantsLoaded.pipe(first()).subscribe(() => {
      const tenant: string = this.route.snapshot.paramMap.get('tenant');
      if (this.dataService.verifyTenant(tenant)) {
        this.dataService.tenant = tenant;
        localStorage.setItem('tenant', this.dataService.tenant);
        if (!this.appService.accreditationConfig) {
          this.dataService.getAccreditationConfigList().pipe(first()).subscribe((accreditationConfigs: AccreditationConfig[]) => {
            this.appService.accreditationConfig = new AccreditationConfigViewModel(accreditationConfigs.pop());
            this.appService.accreditationConfigLoadedSubject.next();
          });
        }
      }
    });
    this.eventCode = localStorage.getItem('eventCode');
    this.appService.showBackButton = false;
    setTimeout(() => {
      this.showSplash = !this.showSplash;
    }, 1500);
    this.subscriptions.push(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToOrderList();
        });
      }
      this.backToOrderList();
    }));
  }
  private backToOrderList = (): void => {
    this.router.navigateByUrl('/event-verifier');
    this.appService.showBackButton = false;
  }
  getEventDetail() {
    if (this.eventCode) {
      const eventCode: EventCode = {
        login: this.eventCode,
      };
      this.subscriptions.push(this.dataService.getEventByCode<Accreditation>(eventCode).subscribe((eventDetail) => {
        localStorage.setItem('eventCode', this.eventCode);
        this.appService.eventDetail = new EventViewModel(
          eventDetail.a_event_
        )
      }, (error) => {

        const message: IToast = {
          message: "Ungültiger Code",
          type: ToastType.ERROR
        };
        this.appService.callNotification(message);
      }
        , () => {
          this.appService.showBackButton = true;
          this.router.navigate([SINECTROUTES.EVENT_DETAIL]);
        }
      )
      );
    } else {
      const message: IToast = {
        message: "lege code",
        type: ToastType.ERROR
      };
      //this.appService.callNotification(message);
    }
  }
}

























