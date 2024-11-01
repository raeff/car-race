import { Car, Brand } from "@ideenherd";

export class CarViewModel {
    protected car: Car;
    get id(): number { return this.car.c_id; }
    get organisationId(): number { return this.car.c_organisation_id; }
    get modelId(): number { return this.car.c_model_id; }
    get name(): string { return this.car.c_name; }
    get licensePlate(): string { return this.car.c_license_plate; }
    get variant(): string { return this.car.c_variant; }
    get engine(): string { return this.car.c_engine; }
    get image(): string { return this.car.c_image; }
    get model(): BrandViewModel { return new BrandViewModel(this.car.c_model_); }

    constructor(carData: Car) {
        this.car = carData;
    }
}

export class BrandViewModel {
    protected brand: Brand;

    get id(): number { return this.brand.m_brand_id; }
    get name(): string { return this.brand.m_name; }
    get image(): string { return this.brand.m_image; }

    constructor(brandData: Brand) {
        this.brand = brandData;
    }
}