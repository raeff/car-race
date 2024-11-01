import { EventUser } from '@ideenherd';
import { UserViewModel } from './user.view-model';

export class EventUserViewModel {
    protected eventUserData: EventUser;
    get id(): number {
        return this.eventUserData.ue_id;
    }
    get userEventId(): number {
        return this.eventUserData.ue_e_id;
    }
    get user(): UserViewModel {
        return new UserViewModel(this.eventUserData.ue_u_);
    }
    get checked(): boolean {
        let isChecked: boolean
        if (this.eventUserData.ue_check_in === 0) {
            isChecked = false;
        } else {
            isChecked = true;
        }
        return isChecked;
    }
    set checked(isChecked: boolean) {        
        if (isChecked === true) {
            this.eventUserData.ue_check_in = 1;
        } else {
            this.eventUserData.ue_check_in = 0;
        }
    }

    constructor(eventUser: EventUser) {
        this.eventUserData = eventUser;
    }
}
