import { SINECTROUTES } from '../../app-routing.module';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConvertHelper, DataService } from '@ideenherd/core/data';
import { Subscription } from 'rxjs';
import { AppService } from '../../app.service';
import { Item } from 'devextreme/ui/button_group';
import { EventUserViewModel } from '../view-models/event-user.view-model';
@Component({
  selector: 'ideenherd-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.scss']
})
export class ParticipantsComponent implements OnInit, AfterViewInit {

  public convertHelper = ConvertHelper;
  public checkedParticipantFilter: Item[];
  private subscriptions: Subscription = new Subscription();
  public eventUsersList: EventUserViewModel[] = [];
  public showLoader = false;

  constructor(private router: Router, public appService: AppService, private dataService: DataService) {
    this.checkedParticipantFilter = [
      {
        template: `<img style="height: 20px; width: 20px; "
        src="assets/images/check-green.svg" />`},
      {
        template: `<img style="height: 20px; width: 20px; "
        src="assets/images/check-gray.svg" />`},
      { template: `alle` }];
  }

  ngOnInit(): void {
    this.showLoader = true;
    this.appService.showBackButton = true;
    this.eventUsersList = this.appService.participantList;
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToEventDetail();
        });
      }
      this.backToEventDetail();
    }));
  }

  ngAfterViewInit(): void {
    const radioGroup = document.getElementById('filterGroupParticipant');
    radioGroup.style.float = 'right';
    const searchBar = document.getElementsByClassName('dx-list-search')[0];
    searchBar.insertAdjacentElement('beforebegin', radioGroup);
    this.showLoader = false;
  }

  public changeFilter(e): void {
    if (this.checkedParticipantFilter.indexOf(e.value) === 0) {
      this.eventUsersList = this.appService.checkedParticipantList;
    }
    else if (this.checkedParticipantFilter.indexOf(e.value) === 1) {
      this.eventUsersList = this.appService.uncheckedParticipantList;
    } else {
      this.eventUsersList = this.appService.participantList;
    }
  }


  private backToEventDetail = (): void => {
    this.router.navigateByUrl(SINECTROUTES.EVENT_DETAIL);
  }

  public getParicipantScanner(): void {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.PARTICIPANT_LIST)
    ]);
  }

  public getParticipantDetail(e): void {
    this.appService.eventParticipantDetail = e.itemData;
    this.router.navigateByUrl(SINECTROUTES.PARTICIPANT_DETAIL);
  }
}





