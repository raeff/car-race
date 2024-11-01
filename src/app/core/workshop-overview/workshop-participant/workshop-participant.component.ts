import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IToast, ToastType, User, UserWorkshop } from '@ideenherd';
import { ConvertHelper, DataService, PersistenceService } from '@ideenherd/core/data';
import { map, Subscription, pipe, switchMap } from 'rxjs';
import { SINECTROUTES } from '../../../app-routing.module';
import { AppService } from '../../../app.service';
import { UserWorkshopViewModel } from '../../view-models/user-workshop.view-model';
import { WorkshopViewModel } from '../../view-models/workshop.view-model';
@Component({
  selector: 'ideenherd-workshop-participant',
  templateUrl: './workshop-participant.component.html',
  styleUrls: ['./workshop-participant.component.scss']
})
export class WorkshopParticipantComponent implements OnInit {
  public disableCheckButton = false;
  public workshop: WorkshopViewModel;
  public convertHelper = ConvertHelper;
  public workshopList: WorkshopViewModel[] = [];
  public suggestedWorkshopsToBeRemovedData: WorkshopViewModel[] = [];
  public showLoader = false;

  suggestedUserWorkShop: UserWorkshopViewModel[] = [];

  private subscriptions: Subscription = new Subscription();
  constructor(private router: Router, public appService: AppService, public dataService: DataService, private activeRoute: ActivatedRoute,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit(): void {
    this.workshopList = this.appService.workshopList;
    this.appService.showBackButton = true;
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      this.backWorkshopParticipants();
    }));
    this.suggestedWorkshopsToBeRemoved();
  }

  private backWorkshopParticipants = (): void => {
    this.router.navigate([
      SINECTROUTES.WORKSHOP_PARTICIPANT_LIST.replace(':path', this.appService.currentWorkshopId),
    ]);
  }

  public participantRegisteredForWorkshop(): boolean {
    return this.appService.workShopUsers.some(test => test.user.id === this.appService.currentUserWorkshopDetail.user.id)
  }

  public setWorkshopUser(check: boolean) {
    this.disableCheckButton = true;
    this.showLoader = true;
    const body = {} as any;
    if (check) {
      body.wu_check_in = new Date().toISOString();
      body.wu_check_out = null;
      this.appService.currentUserWorkshopDetail.checkOutDate = null;
    } else {
      body.wu_check_out = new Date().toISOString();
      this.appService.currentUserWorkshopDetail.checkOutDate = new Date();
    }
    this.persistenceService.updateUserWorkShopById(this.appService.currentUserWorkshopDetail.userWorkshopId, body).subscribe((updated) => {
      this.appService.prepareWorkshopData(+this.appService.currentWorkshopId);
    }, error => {
      this.disableCheckButton = false;
      this.showLoader = false;
      console.error(error);
      this.appService.notrifyError(error);
    }, () => {
      this.disableCheckButton = false;
      this.showLoader = false;
      const notification: IToast = { message: "", type: ToastType.SUCCESS, displayTime: 2000 };
      if (check === true) notification.message = "Teilnehmer erfolgreich eingecheckt";
      else notification.message = "Teilnehmer erfolgreich ausgecheckt";
      this.appService.callNotification(notification);
    })
  }

  public getParicipantScanner(): void {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.WORKSHOP_PARTICIPANT_DETAIL),
    ]);
  }

  public checkPreviousPath(): boolean {
    //true if coming from scanner , false if coming from particpants list
    return history.state.scan;
  }

  public checkUpdateCheckIn(): boolean {
    //true if coming from scanner , false if coming from particpants list
    return history.state.updated;
  }

  public checkParticipantInscription(): boolean {
    if (this.appService.workShopUsers.find((wu) =>
      this.appService.currentUserWorkshopDetail?.userWorkshopId == wu.userWorkshopId
    )) {
      return true;
    } else {
      return false;
    }
  }

  public compareDateWithoutTime(inputDate1: Date, inputDate2: Date): boolean {
    const date1 = new Date(inputDate1);
    const date2 = new Date(inputDate2);
    const date1WithoutTime = new Date(date1.getTime());
    const date2WithoutTime = new Date(date2.getTime());
    date1WithoutTime.setUTCHours(0, 0, 0, 0);
    date2WithoutTime.setUTCHours(0, 0, 0, 0);
    if (date1WithoutTime.getTime() === date2WithoutTime.getTime()) {
      return true
    } else return false
  }

  public deleteWorkshopUser(event): void {
    const participantWorkShops = this.suggestedUserWorkShop.filter((wu) => {
      if (wu.user.id == this.appService.currentUserWorkshopDetail.user.id && wu.id == event.itemData.id) {
        return true;
      } else {
        return false;
      }
    });
    const body = {
      "wu_u_id": this.appService.currentUserWorkshopDetail.user.id,
      "wu_w_id": this.appService.workshopDetail.id,
      "wu_check_in": new Date().toISOString(),
    }
    this.subscriptions.add(this.persistenceService.deleteUserWorkShop(participantWorkShops[0].userWorkshopId).pipe(switchMap(() => {
      return this.persistenceService.insertUserWorkShop(body)
        .pipe(switchMap(() => {
          return this.appService.prepareWorkshopData(+this.appService.currentWorkshopId)
        }))
    })).subscribe(() => {
      this.suggestedWorkshopsToBeRemovedData = this.suggestedWorkshopsToBeRemovedData.filter((wbr) => wbr.id != event.itemData.id)

    }, error => {
      console.error(error);
    }, () => {

    }));
  }

  public suggestedWorkshopsToBeRemoved() {
    this.dataService.getUsersWorkshopByUserId(this.appService.currentUserWorkshopDetail.user.id).subscribe((workshopUsers) => {
      this.suggestedUserWorkShop = workshopUsers.filter((wsu) => wsu.wu_check_in == null).map((workshopUser) => new UserWorkshopViewModel(workshopUser))
      const ids = workshopUsers.filter((wsu) => wsu.wu_check_in == null).map((wu) => wu.wu_w_id);

      this.suggestedWorkshopsToBeRemovedData = this.appService.workshopList.filter((workshop) =>
      ((ids.includes(workshop.id) &&
        this.compareDateWithoutTime(this.appService.workshopDetail.startDate, workshop.startDate))
      )
      )
    })
  }

  public insertParticipant(): void {
    const body = {
      "wu_u_id": this.appService.currentUserWorkshopDetail.user.id,
      "wu_w_id": this.appService.workshopDetail.id,
      "wu_check_in": new Date().toISOString(),
    }
    this.persistenceService.insertUserWorkShop(body).pipe(switchMap(() => {
      return this.appService.prepareWorkshopData(+this.appService.currentWorkshopId)
    })).subscribe(() => { });
  }
}
