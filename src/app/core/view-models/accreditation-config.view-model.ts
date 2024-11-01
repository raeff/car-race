import { AccreditationConfig } from '@ideenherd';
import { EventViewModel } from './event.view-model';

export interface AppConfig {
  testDrive?: boolean;
  participants?: boolean;
  workshops?: boolean;
}

export interface AppStyling {}

export class AccreditationConfigViewModel {
  protected accreditationConfig: AccreditationConfig;

  get id(): number {
    return this.accreditationConfig.ac_id;
  }
  get config(): AppConfig {
    return this.accreditationConfig?.ac_config ? JSON.parse(this.accreditationConfig.ac_config) : null;
  }
  get styling(): AppStyling {
    return this.accreditationConfig?.ac_styling ? JSON.parse(this.accreditationConfig.ac_styling) : null;
  }
  get logo(): string {
    return this.accreditationConfig ? btoa(String.fromCharCode(...this.accreditationConfig.ac_logo?.data)) : null;
  }
  get event(): EventViewModel {
    return new EventViewModel(this.accreditationConfig.ac_e_);
  }

  constructor(accreditationConfigData: AccreditationConfig) {
    this.accreditationConfig = accreditationConfigData;
  }
}
