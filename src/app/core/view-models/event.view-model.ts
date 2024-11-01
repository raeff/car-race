import { SinectEvent } from "@ideenherd";

export class EventViewModel {
    protected event: SinectEvent;

    get id(): number { return this.event.e_id; }
    get name(): string { return this.event.e_name; }
    get info(): string { return this.event.e_info; }
    get place(): string { return this.event.e_place; }
    get street(): string { return this.event.e_street; }
    get zip(): string { return this.event.e_zip; }
    get city(): string { return this.event.e_city; }
    get email(): string { return this.event.e_email; }
    get phone(): string { return this.event.e_phone; }
    get country(): string { return this.event.e_country; }
    get startDate(): string { return this.event.e_s_date; }
    get endDate(): string { return this.event.e_e_date; }
    get startHotelDate(): string { return this.event.e_s_date_hotel; }
    get endtHotelDate(): string { return this.event.e_e_date_hotel; }
    get arrivalStart(): string { return this.event.e_t_arrival_start; }
    get arrivalEnd(): string { return this.event.e_t_arrival_end; }
    get departureStart(): string { return this.event.e_t_departure_start; }
    get departureEnd(): string { return this.event.e_t_departure_end; }
    get startHour(): string { return this.event.e_e_hour; }
    get ticket(): number { return this.event.e_eticket; }
    constructor(eventData: SinectEvent) {
        this.event = new SinectEvent(eventData);
    }

}