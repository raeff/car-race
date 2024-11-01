import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConvertHelper, PersistenceService } from '@ideenherd/core/data';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
import { CarViewModel } from '../view-models/car.view-model';
import { EventViewModel } from '../view-models/event.view-model';
import { UserViewModel } from '../view-models/user.view-model';
import { Subscription } from 'rxjs';
import DevExpress from 'devextreme';
import { AppointmentViewModel } from '../view-models/appointment.view-model';
import { IAppointment } from 'libs/core/data/src/lib/persistence.service';
@Component({
  selector: 'ideenherd-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.scss'],
})
export class CarDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public startRideDate: Date;
  public endRideDate: Date;
  public convertHelper = ConvertHelper;
  public eventDetail: EventViewModel;
  public carDetail: CarViewModel;
  public scantext = ScanButtontext.SCANDRIVER;
  public driversList: UserViewModel[] = [];
  public driverAllowedToEvent: boolean;
  public toastPosition: DevExpress.PositionConfig = { at: 'top', my: 'center', offset: '0 10' };
  constructor(
    private router: Router,
    public appService: AppService,
    private persistenceService: PersistenceService
  ) { }
  ngOnInit(): void {
    this.driversList = this.appService.driversList;
    this.appService.showBackButton = true;
    this.eventDetail = this.appService.eventDetail;
    this.carDetail = this.appService.carDetail;

    if (this.appService.driversList.length > 0) {
      this.scantext = ScanButtontext.SCANCODRIVER
    }

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
    this.clearDriversData();
    this.router.navigateByUrl(SINECTROUTES.CAR_OVERVIEW);
  }
  public scanDriverLicence(): void {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.CAR_DETAIL),
    ]);
  }
  public insertAppointment(): void {
    const today = new Date();
    const body: IAppointment = {
      a_event_id: this.eventDetail.id,
      a_car_id: this.carDetail.id,
      a_check_in_time: today,
      a_user_id: this.driversList[0].id
    }
    if (this.driversList.length > 1) {
      body.users = [];
      this.driversList.forEach((codDriver, index) => {
        if (index !== 0) body.users.push(codDriver.id.toString());
      })
      body.a_additional_users = JSON.stringify(body.users);
      delete body['users'];
    }
    this.persistenceService.addAppointment(body).subscribe(data => {
      this.appService.appointmentId = data.a_id;
      const appointment = new AppointmentViewModel({
        appointmentId: data.a_id,
        eventId: this.eventDetail.id,
        carId: this.carDetail.id,
        driversList: this.driversList,
        isStarted: true,
        startRideDate: today
      });
      this.appService.appointmentList.push(appointment);
      this.startRideDate = today;
    }, error => {
      console.error(error);
    }, () => {
    })
  }
  public closeAppointment(): void {
    const today = new Date()
    const body = {
      a_check_out_time: today,
    }
    this.endRideDate = today;
    this.persistenceService.updateAppontmentById(this.appService.appointmentId, body).subscribe(data => {
      this.clearDriversData();
      this.appService.currentDriverlist = [];
    }, error => {
      console.error(error);
    })
  }
  private clearDriversData(): void {
    this.appService.driversList = [];
    this.driversList = [];
    this.appService.appointmentId = undefined;
    this.scantext = ScanButtontext.SCANDRIVER;
    this.startRideDate = undefined;
    this.endRideDate = undefined;
  }
  public goToEventDetail(): void {
    this.clearDriversData();
    this.appService.currentDriverlist = [];
    this.router.navigateByUrl(SINECTROUTES.EVENT_DETAIL);
  }
  public updateDriver(driverIndex): void {
    this.appService.updatedDriverindex = driverIndex;
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.CAR_DETAIL),
    ]);
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
export enum ScanButtontext {
  SCANDRIVER = "Fahrer einchecken",
  SCANCODRIVER = "Beifahrer einchecken"
}
