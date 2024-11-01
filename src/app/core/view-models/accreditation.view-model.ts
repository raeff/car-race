import { Accreditation, Car, SinectEvent, User } from '@ideenherd';
import { CarViewModel } from './car.view-model';
import { EventViewModel } from './event.view-model';
import { UserViewModel } from './user.view-model';

export class AccreditationViewModel {
  protected accreditation: Accreditation;

  get id(): number {
    return this.accreditation.a_id;
  }
  get title(): string {
    return this.accreditation.a_title;
  }
  get event(): EventViewModel {
    return new EventViewModel(this.accreditation.a_event_);
  }
  get user(): UserViewModel {
    return new UserViewModel(this.accreditation.a_user_);
  }
  get car(): Car[] {
    return this.accreditation.a_o_;
  }

  constructor(accreditationData: Accreditation) {
    this.accreditation = accreditationData;
  }
}
