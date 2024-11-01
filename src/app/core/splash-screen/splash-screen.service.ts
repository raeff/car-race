import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
@Injectable()
export class SplashScreenService {
  public splashScreenSubject = new Subject<boolean>();

  public showSplashScreen(onNext): Subscription {
    return this.splashScreenSubject.subscribe(onNext);
  }
  public stopSplashScreen() {
    this.splashScreenSubject.next(false);
  }
}
