import { EventVerifierComponent } from './core/event-verifier/event-verifier.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventDetailComponent } from './core/event-detail/event-detail.component';
import { CarOverviewComponent } from './core/car-overview/car-overview.component';
import { EventScannerComponent } from './core/event-scanner/event-scanner.component';
import { CarDetailComponent } from './core/car-detail/car-detail.component';
import { ParticipantsComponent } from './core/participants/participants.component';
import { SplashScreenComponent } from "./core/splash-screen/splash-screen.component";
import { WorkshopOverviewComponent } from './core/workshop-overview/workshop-overview.component';
import { WorkshopParticipantComponent } from './core/workshop-overview/workshop-participant/workshop-participant.component';
import { WorkshopParticipantListComponent } from './core/workshop-overview/workshop-participant-list/workshop-participant-list.component';
import { ParticipantComponent } from './core/participants/participant/participant.component';

const routes: Routes = [
  {
    path: 'event-detail',
    component: EventDetailComponent,
    loadChildren: () =>
      import('./core/event-detail/event-detail.module').then(
        (module) => module.EventDetailModule
      ),
  },
  {
    path: 'car-detail',
    component: CarDetailComponent,
    loadChildren: () =>
      import('./core/car-detail/car-detail.module').then(
        (module) => module.CarDetailModule
      ),
  },
  {
    path: 'event-scanner/:path',
    component: EventScannerComponent,
    loadChildren: () =>
      import('./core/event-scanner/event-scanner.module').then(
        (module) => module.EventScannerModule
      ),
  },
  {
    path: 'car-overview',
    component: CarOverviewComponent,
    loadChildren: () =>
      import('./core/car-overview/car-overview.module').then(
        (module) => module.CarOverviewModule
      ),
  },
  {
    path: 'participant-list',
    component: ParticipantsComponent,
    loadChildren: () =>
      import('./core/participants/participants.module').then(
        (module) => module.ParticipantsModule
      ),
  },
  {
    path: 'workshop-overview',
    component: WorkshopOverviewComponent,
    loadChildren: () =>
      import('./core/workshop-overview/workshop-overview.module').then(
        (module) => module.WorkshopOverviewModule
      ),
  },

  {
    path: 'participant-detail',
    component: ParticipantComponent,
    loadChildren: () =>
      import('./core/participants/participants.module').then(
        (module) => module.ParticipantsModule
      ),
  },
  {
    path: 'workshop-participant-detail',
    component: WorkshopParticipantComponent,
    data: { scan: false, updated: false },
  },
  {
    path: 'workshop-participant-list/:path',
    component: WorkshopParticipantListComponent
  },
  {
    path: ':tenant',
    component: EventVerifierComponent,
    loadChildren: () =>
      import('./core/event-verifier/event-verifier.module').then(
        (module) => module.EventVerifierModule
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
export class SINECTROUTES {
  public static readonly EVENT_DETAIL = 'event-detail';
  public static readonly CAR_DETAIL = 'car-detail';
  public static readonly CAR_DETAIL_STEPPER = 'car-detail/:path';
  public static readonly EVENT_SCANNER = 'event-scanner/:path';
  public static readonly CAR_OVERVIEW = 'car-overview';
  public static readonly PARTICIPANT_LIST = 'participant-list';
  public static readonly WORKSHOP_PARTICIPANT_DETAIL = 'workshop-participant-detail';
  public static readonly PARTICIPANT_DETAIL = 'participant-detail';
  public static readonly WORKSHOP_OVERVIEW = 'workshop-overview';
  public static readonly WORKSHOP_PARTICIPANT_LIST = 'workshop-participant-list/:path';
  public static readonly WORKSHOP_PARTICIPANT_LIST_SCAN = 'workshop-participant-list-scan';
  public static readonly EVENT_DETAIL_PARTICIPANT = 'event-detail-participant';
}
