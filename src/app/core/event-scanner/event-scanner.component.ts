import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Car, IUsersEventsAccreditation, QrScannerComponent, User, UserWorkshop } from '@ideenherd';
import { DataService, PersistenceService } from '@ideenherd/core/data';
import DevExpress from 'devextreme';
import { ICode } from 'libs/core/data/src/lib/data.service';
import { IToast, ToastType } from '@ideenherd';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
import { CarViewModel } from '../view-models/car.view-model';
import { UserViewModel } from '../view-models/user.view-model';
import { EventUserViewModel } from '../view-models/event-user.view-model';
import { UserWorkshopViewModel } from '../view-models/user-workshop.view-model';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'ideenherd-event-scanner',
  templateUrl: './event-scanner.component.html',
  styleUrls: ['./event-scanner.component.scss']
})
export class EventScannerComponent implements OnInit, OnDestroy {
  @ViewChild('scanner') scanner: QrScannerComponent
  public QrCodeTitle = QrMessages.SCANCAR;
  public toastPosition: DevExpress.PositionConfig = { at: 'top', my: 'center', offset: '0 100' };
  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  private scanningDone = false;
  public updateCheckIn = false;
  public userByQrCode: User;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private dataService: DataService,
    public appService: AppService,
    private persistenceService: PersistenceService
  ) { }
  ngOnInit(): void {
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToEventDetail();
        });
      }
      this.backToEventDetail();
    }));
    const path = this.activeRoute.snapshot.paramMap.get('path');
    if (path === SINECTROUTES.CAR_DETAIL) {
      if (this.appService.driversList.length === 0 || this.appService.updatedDriverindex === 0) {
        this.QrCodeTitle = QrMessages.SCANDRIVER;
      } else {
        this.QrCodeTitle = QrMessages.SCANCODRIVER;
      }
    } else {
      this.QrCodeTitle = QrMessages.PARTICIPANT;
    }
  }
  private backToEventDetail = (): void => {
    const path = this.activeRoute.snapshot.paramMap.get('path');
    if (path === SINECTROUTES.CAR_DETAIL) {
      this.router.navigateByUrl('/car-detail');
      this.appService.showBackButton = true;
      this.appService.driversList = [...this.appService.currentDriverlist];
    }
    else if (path === SINECTROUTES.CAR_OVERVIEW) {
      this.router.navigateByUrl('/car-overview');
      this.appService.showBackButton = true;
    }
    else if (path === SINECTROUTES.PARTICIPANT_LIST) {
      this.router.navigateByUrl('/participant-list');
      this.appService.showBackButton = true;
    }
    else if (path === SINECTROUTES.WORKSHOP_PARTICIPANT_LIST) {
      this.router.navigateByUrl('/workshop-participant-list');
      this.appService.showBackButton = true;
    }
    else if (path === SINECTROUTES.PARTICIPANT_DETAIL) {
      this.router.navigateByUrl('/participant-detail');
      this.appService.showBackButton = true;
    }
    else if (path === SINECTROUTES.WORKSHOP_PARTICIPANT_DETAIL) {
      this.router.navigateByUrl('/workshop-participant-detail');
      this.appService.showBackButton = true;
    }
    else {
      this.router.navigateByUrl('/event-detail');
      this.appService.showBackButton = true;
    }
  }

  public scanSuccess(e) {
    const path = this.activeRoute.snapshot.paramMap.get('path');
    const body: ICode = {
      code: e
    }
    if (path === SINECTROUTES.EVENT_DETAIL || path === SINECTROUTES.CAR_OVERVIEW) {
      if (e.includes("_")) {
        const searchTerm = '_';
        const indexOfFirstTerm = e.indexOf(searchTerm);
        const carId = e.substring(e.indexOf(searchTerm, (indexOfFirstTerm + 1)) + 1);
        body.code = carId;
      }
      this.subscriptions.add(
        this.dataService.getCarDetailByCode<Car>(body).subscribe((carDetail) => {
          this.appService.carDetail = new CarViewModel(carDetail);
        }, (error) => {
          const message: IToast = {
            message: "auto ongeldig",
            type: ToastType.ERROR
          };
          this.appService.callNotification(message);
          console.error(error);
        }, () => {
          this.appService.currentDriverlist = [];
          this.router.navigate([SINECTROUTES.CAR_DETAIL]);
        }
        )
      );
    } else if (path === SINECTROUTES.CAR_DETAIL) {
      this.subscriptions.add(this.dataService.getParticipantByCode<User>(body).pipe(takeUntil(this.destroy$)).subscribe(driverDetail => {
        const driver = new UserViewModel(driverDetail);
        driver.currentEventId = this.appService.eventDetail.id;
        const driverAlreadyAssigned = this.appService.driversList.find(driver => driver.id === driverDetail.u_id);
        if ((this.appService.updatedDriverindex || this.appService.updatedDriverindex === 0) && !driverAlreadyAssigned) {
          this.appService.driversList[this.appService.updatedDriverindex] = driver;
          this.appService.currentDriverlist[this.appService.updatedDriverindex] = driver;
        } else if (!this.appService.updatedDriverindex && !driverAlreadyAssigned) {
          this.appService.driversList.push(driver);
          this.appService.currentDriverlist.push(driver);
        } else {
          const message: IToast = {
            message: "Fahrer bereits zugewiesen",
            type: ToastType.INFO
          };
          this.appService.callNotification(message);
        }
      }, error => {
        console.error(error);
        const message: IToast = {
          message: "fahrer ongeldig",
          type: ToastType.ERROR
        };
        this.appService.callNotification(message);
      }, () => {
        this.destroy$.next();
        this.destroy$.complete();
        this.router.navigate([SINECTROUTES.CAR_DETAIL]);
        this.appService.updatedDriverindex = undefined;
      }))
    }
    else if ((path === SINECTROUTES.PARTICIPANT_LIST || path === SINECTROUTES.EVENT_DETAIL_PARTICIPANT || path === SINECTROUTES.PARTICIPANT_DETAIL) && this.scanningDone === false) {
      this.scanningDone = true;
      this.scanner.enableScanner = false;
      this.appService.scannerProcessLoader = true;
      if (e.includes("_")) {
        const searchTerm = '_';
        const indexOfFirstTerm = e.indexOf(searchTerm);
        const participantId = e.substring(indexOfFirstTerm + 1, e.length);
        body.code = participantId;
      }
      this.subscriptions.add(this.dataService.getParticipantByCode<User>(body).pipe(takeUntil(this.destroy$)).subscribe(participantDetail => {
        const scanedParticipant = new UserViewModel(participantDetail);
        if (this.appService.participantList.some(test => test.user.id === scanedParticipant.id)) {
          const body = {
            ue_check_in: 1,
          }
          this.persistenceService.updateUserEventById(this.appService.participantList.find(test => test.user.id === scanedParticipant.id).id, body).subscribe(() => {
            this.appService.prepareParticipantData(scanedParticipant.id);
            const query: IUsersEventsAccreditation = {
              uea_e_id: this.appService.eventDetail.id,
              uea_u_id: scanedParticipant.id,
              uea_day: new Date(),
              uea_datetime: new Date().toISOString(),
              uea_action: 1
            }
            this.persistenceService.insertUsersEventsAccreditation(query).subscribe();
          }, error => {

          }, () => {
            this.destroy$.next();
            this.destroy$.complete();
          })
        }
      }, error => {
        this.appService.scannerProcessLoader = false;
        this.scanner.enableScanner = true;
        this.scanningDone = false;
        this.appService.notrifyError(error);
        console.error(error);
      }, () => {
        this.destroy$.next();
        this.destroy$.complete();
      }));

    }
    else if ((path === SINECTROUTES.WORKSHOP_PARTICIPANT_LIST_SCAN || path === SINECTROUTES.WORKSHOP_PARTICIPANT_DETAIL) && this.scanningDone === false) {
      this.scanningDone = true;
      this.scanner.enableScanner = false;
      this.appService.scannerProcessLoader = true
      if (e.includes("_")) {
        const searchTerm = '_';
        const indexOfFirstTerm = e.indexOf(searchTerm);
        const participantId = e.substring(indexOfFirstTerm + 1, e.length);
        body.code = participantId;
      }
      this.subscriptions.add(this.dataService.getParticipantByCode<User>(body).pipe(takeUntil(this.destroy$)).subscribe(user => {
        this.userByQrCode = user;
        if (this.appService.workShopUsers.some(ws => (ws.user.id === user.u_id &&
          ws.id.toString() === this.appService.currentWorkshopId))) {
          const body = {
            wu_check_in: new Date().toISOString(),
            wu_check_out: null
          }
          const workShopUser = this.appService.workShopUsers.find(ws => (
            ws.user.id === user.u_id &&
            ws.id.toString() === this.appService.currentWorkshopId
          ));
          this.persistenceService.updateUserWorkShopById(workShopUser.userWorkshopId, body).subscribe((updated) => {
            this.appService.prepareWorkshopData(+this.appService.currentWorkshopId);
          }, error => {
            console.error(error);
          })
          this.updateCheckIn = true;
        }
      }, error => {
        this.appService.scannerProcessLoader = false;
        this.scanningDone = false;
        this.scanner.enableScanner = true;
        this.appService.notrifyError(error);
        console.error(error);
      }, () => {
        const UserWorkshopData = new UserWorkshop({
          wu_check_in: null,
          wu_check_out: null,
          wu_creation_date: new Date().toISOString(),
          wu_u_: this.userByQrCode
        })
        this.appService.currentUserWorkshopDetail = new UserWorkshopViewModel(UserWorkshopData);
        this.appService.scannerProcessLoader = false;
        this.router.navigate([SINECTROUTES.WORKSHOP_PARTICIPANT_DETAIL], {
          state: {
            scan: true,
            updated: this.updateCheckIn
          }
        });
      }));
    }
  }

  clearParticipantData() {
    this.appService.participantList = [];
    this.appService.checkedParticipantList = [];
    this.appService.uncheckedParticipantList = [];
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private playAudio(): void {
    let audio = new Audio();
    audio.src = "../../assets/audio/Barcode-scanner-beep-sound.mp3";
    audio.load();
    audio.play();
  }

}
export enum QrMessages {
  SCANCAR = 'Fahrzeug Code scannen',
  SCANDRIVER = 'Fahrer Code scannen',
  SCANCODRIVER = 'Beifahrer Code scannen',
  PARTICIPANT = 'Teilnehmer Code scannen',
}
