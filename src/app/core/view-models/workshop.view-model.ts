import { WorkShop } from '@ideenherd';

export class WorkshopViewModel {
    protected workshopData: WorkShop;

    get id(): number {
        return this.workshopData.w_id;
    }
    get eventId(): number {
        return this.workshopData.w_e_id;
    }
    get name(): string {
        return this.workshopData.w_name;
    }
    get description(): string {
        return this.workshopData.w_description;
    }
    get maxParticipant(): number {
        return this.workshopData.w_max_participant;
    }
    get minParticipant(): number {
        return this.workshopData.w_min_participant;
    }
    get startDate(): Date {
        return this.workshopData.w_s_date;
    }
    get endDate(): Date {
        return this.workshopData.w_e_date;
    }
    get workshopStartTime(): Date {
        return this.workshopData.w_s_time_start;
    }
    get workshopEndTime(): Date {
        return this.workshopData.w_s_time_end;
    }

    get state(): boolean {
        const currentDate = new Date();
        let currentState: boolean;
        if (new Date(this.workshopData.w_s_date) >= currentDate) { currentState = true; }
        else { currentState = false; }
        return currentState;
    }

    constructor(workshopData: WorkShop) {
        this.workshopData = workshopData;
    }
}
