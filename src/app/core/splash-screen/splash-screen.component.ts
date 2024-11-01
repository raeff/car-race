import { Component, OnInit } from '@angular/core';
import { SplashScreenService } from './splash-screen.service';
@Component({
  selector: 'ideenherd-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent implements OnInit {
  readonly ANIMATION_DURATION = 1;
  public opacityChange = 1;
  public splashTransition;
  public showSplash = true;

  constructor(private splashScreenService: SplashScreenService) { }

  ngOnInit(): void {
    this.splashScreenService.splashScreenSubject.subscribe((res) => {
      this.hideSplashAnimation();
    });
  }
  private hideSplashAnimation(): void {
    this.splashTransition = `opacity ${this.ANIMATION_DURATION}s`;
    this.opacityChange = 0;
    setTimeout(() => {
      this.showSplash = !this.showSplash;
    }, 1000);
  }
}
