import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConvertHelper, DataService } from '@ideenherd/core/data';
import { Subscription } from 'rxjs';
import { SINECTROUTES } from '../../../app-routing.module';
import { AppService } from '../../../app.service';
import { Item } from 'devextreme/ui/button_group';
import { UserWorkshopViewModel } from '../../view-models/user-workshop.view-model';
@Component({
  selector: 'ideenherd-workshop-participant-list',
  templateUrl: './workshop-participant-list.component.html',
  styleUrls: ['./workshop-participant-list.component.scss']
})
export class WorkshopParticipantListComponent implements OnInit, AfterViewInit {

  public convertHelper = ConvertHelper;
  public workShopUsers: UserWorkshopViewModel[] = [];
  public unfiltredWorkShopUsers: UserWorkshopViewModel[] = [];
  public participantsIds: number[] = [];
  public checkedParticipantFilter: Item[] = [
    {
      template: `<img style="height: 20px; width: 20px; "
      src="assets/images/check-green.svg" />`},
    {
      template: `<img style="height: 20px; width: 20px; "
      src="assets/images/check-gray.svg" />`},
    { template: `alle` }];

  private subscriptions: Subscription = new Subscription();

  constructor(private router: Router,
    public appService: AppService,
    private activeRoute: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.appService.showLoader = true;
    
    this.appService.showBackButton = true;
    const workshopId = this.activeRoute.snapshot.paramMap.get('path');
    this.appService.currentWorkshopId = workshopId;
    this.workShopUsers = this.appService.prepareWorkshopData(+workshopId);
    this.unfiltredWorkShopUsers = this.workShopUsers;
    this.appService.workShopUsers = this.workShopUsers;
    this.subscriptions.add(this.appService.backButtonS$.subscribe(() => {
      if (window['deviceReady'] == true) {
        document.addEventListener("backbutton", function (e) {
          this.backToWorkshops();
        });
      }
      this.backToWorkshops();
    }));
  }

  private backToWorkshops = (): void => {
    this.router.navigateByUrl(SINECTROUTES.WORKSHOP_OVERVIEW);
  }

  ngAfterViewInit(): void {
    const radioGroup = document.getElementById('filterGroupParticipant');
    radioGroup.style.float = 'right';
    const searchBar = document.getElementsByClassName('dx-list-search')[0];
    searchBar.insertAdjacentElement('beforebegin', radioGroup);
  }

  changeFilter(e): void {
    if (this.checkedParticipantFilter.indexOf(e.value) === 0) {
      const checkedWorkShopUsers = this.unfiltredWorkShopUsers.filter(user => user.checkInDate);
      this.workShopUsers = checkedWorkShopUsers;
    }
    else if (this.checkedParticipantFilter.indexOf(e.value) === 1) {
      const uncheckedWorkShopUsers = this.unfiltredWorkShopUsers.filter(user => !user.checkInDate);
      this.workShopUsers = uncheckedWorkShopUsers;
    } else {
      this.workShopUsers = this.unfiltredWorkShopUsers;
    }
  }

  public getParicipantScanner(): void {
    this.router.navigate([
      SINECTROUTES.EVENT_SCANNER.replace(':path', SINECTROUTES.WORKSHOP_PARTICIPANT_LIST_SCAN)
    ]);
  }

  public getParticipantDetail(e): void {
    this.appService.currentUserWorkshopDetail = e.itemData;
    this.router.navigate([SINECTROUTES.WORKSHOP_PARTICIPANT_DETAIL], {
      state: {
        scan: false,
        updated: e.itemData.checkInDate != undefined && e.itemData.checkInDate != null ? true : false
      }
    });
  }

}
