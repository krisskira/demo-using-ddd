import { IdentificationType, JobArea, JobCountry, User } from "../entities";

export const USERS_DATA: User[] = [
    {
        id: "1",
        firstname: "CRHISTIAN",
        middleName: "DAVID",
        lastname: "VERGARA",
        secondLastname: "GOMEZ",
        area: JobArea.Administrative,
        email: "crhsitian.vergara00@gmail.com",
        createdAt: new Date(),
        entryAt: new Date(),
        identificationNumber: "A-123456789",
        identificationType: IdentificationType.CC,
        jobCountry: JobCountry.CO,
        active: true,
    },
    {
        id: "2",
        firstname: "JUAN",
        middleName: "",
        lastname: "perez",
        secondLastname: "",
        area: JobArea.Administrative,
        email: "juan.perez@gmail.com",
        entryAt: new Date(new Date().getMonth() - 1),
        createdAt: new Date(),
        identificationNumber: "B-123456789",
        identificationType: IdentificationType.NIT,
        jobCountry: JobCountry.US,
        active: true,
    },
];
