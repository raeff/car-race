import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { IToast, ToastType } from '@ideenherd';

import { AccreditationConfigViewModel } from './core/view-models/accreditation-config.view-model';
import { CarViewModel } from './core/view-models/car.view-model';
import { EventViewModel } from './core/view-models/event.view-model';
import { UserViewModel } from './core/view-models/user.view-model';
import { AppointmentViewModel } from './core/view-models/appointment.view-model';
import { WorkshopViewModel } from './core/view-models/workshop.view-model';
import { UserWorkshopViewModel } from './core/view-models/user-workshop.view-model';
import { EventUserViewModel } from './core/view-models/event-user.view-model';
import { DataService } from '@ideenherd/core/data';
import { SINECTROUTES } from './app-routing.module';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AppService {
  public allowedWorkshopUsers: UserWorkshopViewModel[] = [];
  public accreditationConfig: AccreditationConfigViewModel;
  public eventDetail: EventViewModel;
  public carDetail: CarViewModel;
  public appointmentId: number;
  public updatedDriverindex: number;
  public driversList: UserViewModel[] = [];
  public carList: CarViewModel[] = [];
  public appointmentList: AppointmentViewModel[] = [];
  private backButtonSubject = new Subject<void>();
  public backButtonS$ = this.backButtonSubject.asObservable();
  public showBackButton = false;
  private notificationSubject: Subject<IToast> = new Subject();
  public notification$ = this.notificationSubject.asObservable();
  public currentDriverlist: UserViewModel[] = [];
  public workshopList: WorkshopViewModel[] = [];
  public activeWorkshopList: WorkshopViewModel[] = [];
  public closedWorkshopList: WorkshopViewModel[] = [];
  public participantList: EventUserViewModel[] = [];
  public checkedParticipantList: EventUserViewModel[] = [];
  public uncheckedParticipantList: EventUserViewModel[] = [];
  public workshopDetail: WorkshopViewModel;
  public workshopDetailParticipants: { checkIns: number, inscriptions: number };
  public workshopParticipantsIds: number[];
  public currentUserWorkshopDetail: UserWorkshopViewModel;
  public currentWorkshopId: string;
  public workShopUsers: UserWorkshopViewModel[] = [];
  public checkedWorkShopUsers: UserWorkshopViewModel[] = [];
  public uncheckedWorkShopUsers: UserWorkshopViewModel[] = [];
  public eventParticipantDetail: EventUserViewModel;
  private _accreditationConfigLoadedSubject: ReplaySubject<void> = new ReplaySubject<void>(1);
  public showLoader = false;
  public scannerProcessLoader: boolean;

  public workshopAvailablePlaces: number;

  constructor(private dataService: DataService, private router: Router) { }

  get accreditationConfigLoadedSubject(): ReplaySubject<void> {
    return this._accreditationConfigLoadedSubject;
  }

  get accreditationConfigLoaded(): Observable<void> {
    return this._accreditationConfigLoadedSubject.asObservable();
  }

  public callNotification(notification: IToast): void {
    this.notificationSubject.next(notification);
  }

  public callBackButton(): void {
    this.backButtonSubject.next();
  }

  public clearData(): void {
    this.carList = [];
    this.workshopList = [];
    this.participantList = [];
    this.checkedParticipantList = [];
    this.uncheckedParticipantList = [];
  }

  public prepareParticipantData(scanedParticipantId: number): void {
    this.clearParticipantData();
    this.dataService.getUsersEventByEventId(this.eventDetail.id).subscribe(userEvents => {
      userEvents
        .filter(participant => (participant.ue_u_.u_global_authorisation < 10)) // >= 10 are admin users
        .forEach(participant => {
          const eventUser = new EventUserViewModel(participant);
          if (eventUser.user.id === scanedParticipantId) {
            this.eventParticipantDetail = eventUser;
          }
          if (eventUser.checked === false) {
            this.uncheckedParticipantList.push(eventUser);
          } else {
            this.checkedParticipantList.push(eventUser);
          }
          this.participantList.push(eventUser);
        });
    }, error => {
      console.error(error);
    }, () => {
      this.scannerProcessLoader = false;
      this.router.navigate([SINECTROUTES.PARTICIPANT_DETAIL]);
    });
  }

  public updateParticipantData(scanedParticipantId: number, isChecked: boolean): void {
    let removeFromArray: EventUserViewModel[] = [];
    let addToArray: EventUserViewModel[] = [];
    if (isChecked === true) {
      removeFromArray = this.uncheckedParticipantList;
      addToArray = this.checkedParticipantList;
    } else {
      removeFromArray = this.checkedParticipantList;
      addToArray = this.uncheckedParticipantList;
    }
    const participant = removeFromArray.find(item => item.user.id === scanedParticipantId);
    const participantIndex = removeFromArray.findIndex(item => item.user.id === scanedParticipantId);
    participant.checked = isChecked;
    addToArray.push(participant);
    removeFromArray.splice(participantIndex, 1);
  }

  public prepareWorkshopData(workshopId: number): UserWorkshopViewModel[] {
    const workShopUsers: UserWorkshopViewModel[] = [];
    this.clearWorkshopsData();
    this.dataService.getUsersWorkshopByWorkshopId(+workshopId).subscribe(data => {
      if (this.workshopDetail.maxParticipant != 0) {
        this.workshopAvailablePlaces = this.workshopDetail.maxParticipant - data?.length;
        if (this.workshopAvailablePlaces < 0) {
          this.workshopAvailablePlaces = 0;
        }
      } else {
        this.workshopAvailablePlaces = 0;
      }
      if (data?.length) {
        data.forEach(user => {
          const wsUser = new UserWorkshopViewModel(user);
          if (wsUser.checkInDate != null) {
            this.checkedWorkShopUsers.push(wsUser);
          } else {
            this.uncheckedWorkShopUsers.push(wsUser);
          }
          this.workShopUsers.push(wsUser);
        });
      }
    }, (error) => {
      console.error();
      this.showLoader = false;
    }, () => {
      this.workshopDetailParticipants = { inscriptions: this.workShopUsers.length, checkIns: this.getCheckInUsersNumber() }
      this.showLoader = false;
    })
    return workShopUsers;
  }


  clearParticipantData() {
    this.participantList = [];
    this.checkedParticipantList = [];
    this.uncheckedParticipantList = [];
  }

  public clearWorkshopsData(): void {
    this.checkedWorkShopUsers = [];
    this.uncheckedWorkShopUsers = [];
    this.workShopUsers = [];
  }

  public notrifyError(error: HttpErrorResponse): void {
    const notification: IToast = { message: "", type: ToastType.ERROR };
    if (error.status === 404) {
      notification.message = "Falscher Code";
      this.callNotification(notification);
    } else if (error.status === 500) {
      notification.message = "Interner Serverfehler";
      this.callNotification(notification);
    }
  }

  public getCheckInUsersNumber(): number {
    return this.workShopUsers.filter(user => user.checkInDate != undefined).length;
  }
}
