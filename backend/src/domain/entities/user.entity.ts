import { JobArea } from "./area.entity";
import { IdentificationType } from "./identification-type.entity";
import { JobCountry } from "./job-country.entity";

export interface User {
    id?: string;
    firstname: string;
    middleName?: string;
    lastname: string;
    secondLastname: string;
    jobCountry: JobCountry;
    identificationType: IdentificationType;
    identificationNumber: string;
    email: string;
    entryAt: Date;
    area: JobArea;    
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}