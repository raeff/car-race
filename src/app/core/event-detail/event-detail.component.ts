import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Car } from '@ideenherd';
import { ConvertHelper, DataService } from '@ideenherd/core/data';
import { first, Subscription } from 'rxjs';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
import { AppConfig } from '../view-models/accreditation-config.view-model';
import { CarViewModel } from '../view-models/car.view-model';
import { EventViewModel } from '../view-models/event.view-model';
import { WorkshopViewModel } from '../view-models/workshop.view-model';
import { EventUserViewModel } from '../view-models/event-user.view-model';
@Component({
  selector: 'ideenherd-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  public eventDetail: EventViewModel;
  private subscriptions: Subscription = new Subscription();
  public convertHelper = ConvertHelper;
  public showLoader = false;

  public config: AppConfig;

  constructor(
    private router: Router,
    public appService: AppService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.showLoader = true;
    this.appService.showBackButton = true;
    this.eventDetail = this.appService.eventDetail;

    this.appService.accreditationConfigLoaded.pipe(first()).subscribe(() => {
      this.config = this.appService.accreditationConfig.config ?? {};
    });

    if (this.appService.carList.length === 0) {
      this.subscriptions.add(this.dataService.getAllCars<Car[]>().subscribe((cars) => {
        cars.forEach((car) => {
          this.appService.carList.push(new CarViewModel(car));
        });
      }));
    }

    if (this.appService.participantList.length === 0) {
      this.subscriptions.add(this.dataService.getUsersEventByEventId(this.eventDetail?.id).subscribe(userEvents => {
        userEvents
          .filter(participant => (participant.ue_u_.u_global_authorisation < 10)) // >= 10 are admin users
          .forEach(participant => {
            const eventUser = new EventUserViewModel(participant);
            if (eventUser.checked === false) {
              this.appService.uncheckedParticipantList.push(eventUser);
            } else {
              this.appService.checkedParticipantList.push(eventUser);
            }
            this.appService.participantList.push(eventUser);
          });
      }));
    }

    if (this.appService.workshopList.length === 0) {
      this.subscriptions.add(this.dataService.getWorkShopList(this.appService.eventDetail.id).subscribe(WorkShops => {
        WorkShops.forEach((ws) => {
          const workShop = new WorkshopViewModel(ws);
          if (workShop.state === true) {
            this.appService.activeWorkshopList.push(workShop);
          } else {
            this.appService.closedWorkshopList.push(workShop);
          }
          this.appService.workshopList.push(workShop);
        });
      }, error => {
        this.showLoader = false;
      }, () => {
        this.showLoader = false;
      }));
    } else {
      this.showLoader = false;
    }

    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToEventVerifier();
        });
      }
      this.backToEventVerifier();
    }));
  }

  private backToEventVerifier = (): void => {
    this.appService.clearData();
    this.router.navigateByUrl('/event-verifier');
    this.appService.showBackButton = false;
  }

  public getScanner(path: AllowedPath): void {
    if (path === AllowedPath.Car) {
      this.router.navigate([
        SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.EVENT_DETAIL)
      ]);
    } else {
      this.router.navigate([
        SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.EVENT_DETAIL_PARTICIPANT)
      ]);
    }
  }

  public getCarDetail(): void {
    this.router.navigate([SINECTROUTES.CAR_OVERVIEW]);
  }

  public getWorkshops(): void {
    this.router.navigate([SINECTROUTES.WORKSHOP_OVERVIEW]);
  }

  public openParticipantList(): void {
    this.router.navigate([SINECTROUTES.PARTICIPANT_LIST]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
export enum AllowedPath {
  Car = 1,
  Participant,
}
