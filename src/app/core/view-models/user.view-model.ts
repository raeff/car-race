import { User } from "@ideenherd";

export class UserViewModel {
    protected user: User;
    private _currentEventId: number;
    private _checked: boolean;
    get id(): number { return this.user.u_id; }
    get eventId(): number { return this.user.u_event_id; }
    get company(): string { return this.user.u_company; }
    get firstName(): string { return this.user.u_forename; }
    get lastName(): string { return this.user.u_surname; }
    get mobile(): string { return this.user.u_mobile; }
    get email(): string { return this.user.u_email; }
    get birthDay(): string { return this.user.u_birthday; }
    get checked(): boolean { return this._checked; }
    get qrCode(): string { return this.user.u_qr_code }
    get licenceValid(): boolean {
        if (this.user.u_drivers_license === 1) {
            return true;
        } else {
            return false;
        }
    }
    get allowedToEvent(): boolean {
        let allowed: boolean;
        if (this.user.db_users_events.length > 0) {
            this.user.db_users_events.find(ue => {
                if (ue.ue_e_.e_id === this._currentEventId) {
                    allowed = true;
                }
                else {
                    allowed = false;
                }
            });
        } else {
            allowed = false;
        }
        return allowed;
    }
    get guestId(): number { return this.user.u_external_id; }
    get avatar(): [] { return this.user.u_avatar.data; }
    set currentEventId(id: number) { this._currentEventId = id; }
    set checked(checked: boolean) { this._checked = checked; }
    constructor(userData: User) {
        this.user = userData;
    }

}
