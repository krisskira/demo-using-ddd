import { registerEnumType } from "type-graphql";
import {
    IdentificationType,
    JobArea,
    JobCountry,
} from "../../../domain/entities";

registerEnumType(IdentificationType, {
    name: "IdentificationType",
    description: "Tipo de identificación",
    valuesConfig: {
        RC: {
            description: "Registro civil",
        },
        TI: {
            description: "Tarjeta de identidad",
        },
        CC: {
            description: "Cédula de ciudadanía",
        },
        CE: {
            description: "Cédula de extranjería",
        },
        NIT: {
            description: "Número de identificación tributaria",
        },
        PP: {
            description: "Pasaporte",
        },
    },
});

registerEnumType(JobArea, {
    name: "JobArea",
    description: "Área de trabajo",
    valuesConfig: {
        Administrative: {
            description: "Administrativo",
        },
        Finantial: {
            description: "Financiero",
        },
        HumanTalent: {
            description: "Recursos Humanos",
        },
        Infrastructure: {
            description: "Infraestructura",
        },
        Operation: {
            description: "Operaciones",
        },
        Shopping: {
            description: "Compras",
        },
        VariousServices: {
            description: "Servicios Varios",
        },
        Others: {
            description: "Otros",
        },
    },
});

registerEnumType(JobCountry, {
    name: "JobCountry",
    description: "País de trabajo",
    valuesConfig: {
        CO: {
            description: "Colombia",
        },
        US: {
            description: "Estados Unidos",
        },
    },
});
