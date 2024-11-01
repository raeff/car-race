import { UserWorkshop, WorkShop } from '@ideenherd';
import { UserViewModel } from './user.view-model';
import { WorkshopViewModel } from './workshop.view-model';

export class UserWorkshopViewModel {
    protected userWorkshopData: UserWorkshop;

    get id(): number {
        return this.userWorkshopData.wu_w_id;
    }
    get workshopUserId(): number {
        return this.userWorkshopData.wu_u_id;
    }
    get userWorkshopId(): number {
        return this.userWorkshopData.wu_id;
    }
    get workshopData(): WorkShop {
        return this.userWorkshopData.wu_w_;
    }
    get user(): UserViewModel {
        return new UserViewModel(this.userWorkshopData.wu_u_);
    }
    get creationDate(): Date {
        return this.userWorkshopData.wu_creation_date;
    }
    get checkInDate(): Date {
        return this.userWorkshopData.wu_check_in;
    }
    get checkOutDate(): Date {
        return this.userWorkshopData.wu_check_out;
    }

    get verified(): boolean {
        return this.checkInDate === undefined;
    }

    set checkInDate(date: Date) {
        this.userWorkshopData.wu_check_in = date;
    }

    set checkOutDate(date: Date) {
        this.userWorkshopData.wu_check_out = date;
    }

    constructor(userWorkshopData: UserWorkshop) {
        this.userWorkshopData = userWorkshopData;
    }
}
