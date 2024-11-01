
export class AppointmentViewModel {
    private _isStarted: boolean;
    private _appointmentId: string;
    private _carId: number;
    private _eventId: number;
    private _startRideDate: Date;
    private _endRideDate: Date;
    private _driversList = [];
    get isStarted(): boolean { return this._isStarted; }
    set isStarted(value: boolean) { this._isStarted = value; }
    get startRideDate(): Date { return this._startRideDate; }
    set startRideDate(date: Date) { this._startRideDate = date; }
    get endRideDate(): Date { return this._endRideDate; }
    set endRideDate(date: Date) { this._endRideDate = date; }
    get driversList(): any { return this._driversList; }
    set driversList(driver) { this._driversList.push(driver); }
    get appointmentId(): string { return this._appointmentId; }
    set appointmentId(id) { this._appointmentId = id; }
    get carId(): number { return this._carId; }
    set carId(id) { this._carId = id; }
    get eventId(): number { return this._carId; }
    set eventId(id) { this._carId = id; }

    public clearDriverlist(): void {
        this._driversList = [];
    }

    constructor(data) {
        Object.assign(this, data);
    }

}
