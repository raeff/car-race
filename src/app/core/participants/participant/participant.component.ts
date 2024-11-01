import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IToast, IUsersEventsAccreditation, ToastType, User } from '@ideenherd';
import { DataService, PersistenceService } from '@ideenherd/core/data';
import { ICode } from 'libs/core/data/src/lib/data.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { SINECTROUTES } from '../../../app-routing.module';
import { AppService } from '../../../app.service';
import { EventUserViewModel } from '../../view-models/event-user.view-model';
import { UserViewModel } from '../../view-models/user.view-model';

@Component({
  selector: 'ideenherd-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.scss']
})
export class ParticipantComponent implements OnInit {

  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  public showLoader = false;
  public disableCheckButton = false;
  constructor(private router: Router, public appService: AppService,
    private dataService: DataService,
    private persistenceService: PersistenceService) { }

  ngOnInit(): void {
    this.appService.showBackButton = true;
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToParticipantList();
        });
      }
      this.backToParticipantList();
    }));
  }

  private backToParticipantList = (): void => {
    this.router.navigateByUrl(SINECTROUTES.PARTICIPANT_LIST);
  }

  public getParicipantScanner(): void {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.PARTICIPANT_DETAIL)
    ]);
  }

  public setParticipant(check: boolean): void {
    this.showLoader = true;
    this.disableCheckButton = true;
    const body: ICode = { code: this.appService.eventParticipantDetail.user.qrCode };
    this.subscriptions.add(this.dataService.getParticipantByCode<User>(body).pipe(takeUntil(this.destroy$)).subscribe(participantDetail => {
      const scanedParticipant = new UserViewModel(participantDetail);
      if (this.appService.participantList.some(test => test.user.id === scanedParticipant.id)) {
        const body = {
          ue_check_in: (check) ? 1 : 0
        }
        this.persistenceService.updateUserEventById(this.appService.participantList.find(test => test.user.id === scanedParticipant.id).id, body).subscribe(() => {
          this.appService.updateParticipantData(scanedParticipant.id, check);
          if (body.ue_check_in === 1) {
            const query: IUsersEventsAccreditation = {
              uea_e_id: this.appService.eventDetail.id,
              uea_u_id: scanedParticipant.id,
              uea_day: new Date(),
              uea_datetime: new Date().toISOString(),
              uea_action: 1
            }
            this.persistenceService.insertUsersEventsAccreditation(query).subscribe();
          }

        })
      }
    }, error => {
      this.showLoader = false;
      this.disableCheckButton = false;
      console.error(error);
      this.appService.notrifyError(error);
    }, () => {
      const notification: IToast = { message: "", type: ToastType.SUCCESS, displayTime: 2000 };
      if (check === true) notification.message = "Teilnehmer erfolgreich eingecheckt";
      else notification.message = "Teilnehmer erfolgreich ausgecheckt";
      this.appService.callNotification(notification);
      this.showLoader = false;
      this.disableCheckButton = false;
    }));

  }
}

