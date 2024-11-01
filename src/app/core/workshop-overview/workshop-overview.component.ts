import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConvertHelper } from '@ideenherd/core/data';
import { Item } from 'devextreme/ui/button_group';
import { Subscription } from 'rxjs';
import { SINECTROUTES } from '../../app-routing.module';
import { AppService } from '../../app.service';
import { WorkshopViewModel } from '../view-models/workshop.view-model';
@Component({
  selector: 'ideenherd-workshop-overview',
  templateUrl: './workshop-overview.component.html',
  styleUrls: ['./workshop-overview.component.scss']
})
export class WorkshopOverviewComponent implements OnInit, AfterViewInit {

  public convertHelper = ConvertHelper;
  private subscriptions: Subscription = new Subscription();
  public workshopList: WorkshopViewModel[] = [];
  cls = 'initialClassName';
  public checkedParticipantFilter: Item[] = [{
    template: `<img style="height: 20px; width: 20px; "
  src="assets/images/calendar-green.svg" />`},
  {
    template: `<img style="height: 20px; width: 20px; "
  src="assets/images/calendar-red.svg" />`},
  { template: `alle` }];

  constructor(private router: Router, public appService: AppService) { }

  ngOnInit(): void {
    this.appService.showBackButton = true;
    this.workshopList = this.appService.workshopList;
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
    const radioGroup = document.getElementById('filterGroupWorkshop');
    radioGroup.style.float = 'right';
    const searchBar = document.getElementsByClassName('dx-list-search')[0];
    searchBar.insertAdjacentElement('beforebegin', radioGroup);
  }

  changeFilter(e): void {
    if (this.checkedParticipantFilter.indexOf(e.value) === 0) {
      this.workshopList = this.appService.activeWorkshopList;
    } else if (this.checkedParticipantFilter.indexOf(e.value) === 1) {
      this.workshopList = this.appService.closedWorkshopList;
    } else {
      this.workshopList = this.appService.workshopList;
    }
  }

  public getWorkshopParticipantOverview(e): void {
    this.appService.workshopDetail = e.itemData;
    this.router.navigate([SINECTROUTES.WORKSHOP_PARTICIPANT_LIST.replace(':path', e.itemData?.id)]);
  }

  private backToEventDetail = (): void => {
    this.router.navigateByUrl(SINECTROUTES.EVENT_DETAIL);
  }


  public getWorkShopDetail(e): void {
  }
}



