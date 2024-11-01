import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  DxButtonModule,
  DxContextMenuModule,
  DxToolbarModule,
} from 'devextreme-angular';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './core/shared/shared.module';
import { AppComponent } from './app.component';
import { SplashScreenService } from './core/splash-screen/splash-screen.service';
import {
  CoreConfigService,
  CoreConfigurationModule,
} from '@ideenherd/core/configuration';
import { environment } from '../environments/environment';
import { IdeenherdLibraryModule } from '@ideenherd';
import { CoreDataModule } from '@ideenherd/core/data';
@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserModule,
    DxToolbarModule,
    AppRoutingModule,
    DxContextMenuModule,
    CoreConfigurationModule,
    CoreDataModule,
    DxButtonModule,
    IdeenherdLibraryModule,
  ],
  providers: [
    SplashScreenService,
    CoreConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigurationFactory,
      deps: [CoreConfigService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }

export function ConfigurationFactory(globalConfig: CoreConfigService) {
  return () => {
    return new Promise((resolve) => {
      globalConfig.loadConfiguration(environment.API_URL).then((config) => {
        resolve(config);
      });
    });
  };
}
