import {
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    MaxLength,
    Matches,
    MinDate,
    MaxDate,
    ValidateIf,
} from "class-validator";
import { ArgsType, Field, InputType, ObjectType } from "type-graphql";
import { JobArea } from "../../../domain/entities/area.entity";
import {
    IdentificationType,
    JobCountry,
    User,
} from "../../../domain/entities/";

import {
    REGEX_LETTERS_AND_SPACE_UPPER_CASE,
    REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE,
    REGEX_LETTERS_UPPER_CASE,
} from "../../../helpers/regex";
import {
    entryAtValidation,
    getBeforeMonthDate,
} from "../../../helpers/validations";
import { PaginationResponse } from "./filter.typeDef";

@ArgsType()
export class UserInput
    implements
        Omit<User, "id" | "createdAt" | "updatedAt" | "email" | "active">
{
    @Field()
    @MaxLength(20, {
        message: "El nombre no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El nombre debe ser solo letras mayúsculas",
    })
    firstname!: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(50, {
        message: "El segundo nombre no puede tener más de 50 caracteres",
    })
    @Matches(REGEX_LETTERS_AND_SPACE_UPPER_CASE, {
        message:
            "El segundo nombre debe ser solo letras mayúsculas y puede incluir espacios",
    })
    middleName?: string;

    @Field()
    @MaxLength(20, {
        message: "El apellido no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El apellido debe ser solo letras mayúsculas",
    })
    lastname!: string;

    @Field()
    @MaxLength(20, {
        message: "El segundo apellido no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El segundo apellido debe ser solo letras mayúsculas",
    })
    secondLastname!: string;

    @Field(() => JobCountry)
    @IsEnum(JobCountry, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    jobCountry!: JobCountry;

    @Field(() => IdentificationType)
    @IsEnum(IdentificationType, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    identificationType!: IdentificationType;

    @Field()
    @Matches(REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE, {
        message:
            "El número de identificación debe ser solo letras, números o guiones",
    })
    identificationNumber!: string;

    @Field(() => Date)
    @IsDate({
        message: "La fecha de ingreso debe ser una fecha válida",
    })
    @MinDate(getBeforeMonthDate(), {
        message:
            "La fecha de ingreso no debe ser inferior a la fecha actual menos un mes",
    })
    @MaxDate(new Date(), {
        message: "La fecha de ingreso no debe ser superior a la fecha actual",
    })
    entryAt!: Date;

    @Field(() => JobArea)
    @IsEnum(JobArea, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    area!: JobArea;
}

@InputType()
export class UserPartialInput implements Partial<User> {
    @Field({ nullable: true })
    @IsOptional()
    id?: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(20, {
        message: "El nombre no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El nombre debe ser solo letras mayúsculas",
    })
    firstname!: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(50, {
        message: "El segundo nombre no debe tener más de 50 caracteres",
    })
    @Matches(REGEX_LETTERS_AND_SPACE_UPPER_CASE, {
        message:
            "El segundo nombre debe ser solo letras mayúsculas y puede incluir espacios",
    })
    middleName?: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(20, {
        message: "El apellido no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El apellido debe ser solo letras mayúsculas",
    })
    lastname!: string;

    @Field({ nullable: true })
    @IsOptional()
    @MaxLength(20, {
        message: "El segundo apellido no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El segundo apellido debe ser solo letras mayúsculas",
    })
    secondLastname?: string;

    @Field(() => JobCountry, { nullable: true })
    @IsOptional()
    @IsEnum(JobCountry, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    jobCountry!: JobCountry;

    @Field(() => IdentificationType, { nullable: true })
    @IsOptional()
    @IsEnum(IdentificationType, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    identificationType?: IdentificationType;

    @Field({ nullable: true })
    @IsOptional()
    @Matches(REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE, {
        message:
            "El número de identificación debe ser solo letras, números o guiones",
    })
    identificationNumber?: string;

    @Field(() => JobArea, { nullable: true })
    @IsOptional()
    @IsEnum(JobArea, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    area!: JobArea;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    email!: string;
}

@InputType()
export class UserUpdateFilterInput
    implements Partial<Pick<User, "id" | "email" | "identificationNumber">>
{
    @Field({ nullable: true })
    @ValidateIf((o, v) => !(o.identificationNumber || o.email), {
        message: "El número de identificación o id no puede estar vacío",
    })
    id?: string;

    @Field({ nullable: true })
    @ValidateIf((o, v) => !(o.id || o.email), {
        message: "El email o id no puede estar vacío",
    })
    @Matches(REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE, {
        message:
            "El número de identificación debe ser solo letras, números o guiones",
    })
    identificationNumber?: string;

    @Field({ nullable: true })
    @ValidateIf((o, v) => !(o.id || o.identificationNumber))
    @IsEmail({}, { message: "El correo electrónico no es válido" })
    email?: string;
}

@InputType()
export class UserEmailGenerateInput
    implements Pick<User, "firstname" | "lastname" | "jobCountry">
{
    @Field()
    @MaxLength(20, {
        message: "El nombre no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El nombre debe ser solo letras mayúsculas",
    })
    firstname!: string;

    @Field()
    @MaxLength(20, {
        message: "El apellido no puede tener más de 20 caracteres",
    })
    @Matches(REGEX_LETTERS_UPPER_CASE, {
        message: "El apellido debe ser solo letras mayúsculas",
    })
    lastname!: string;

    @Field(() => JobCountry, { nullable: true })
    @IsEnum(JobCountry, {
        message: (args) =>
            `${args.property} debe ser una de las siguientes: ${Object.keys(
                args.constraints[0]
            ).toLocaleString()}`,
    })
    jobCountry!: JobCountry;
}

@ObjectType()
export class UserRegisterResponse {
    @Field()
    id?: string;

    @Field()
    @IsEmail()
    email: string;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    constructor({
        id,
        email,
        createdAt,
        updatedAt,
    }: Pick<User, "id" | "email" | "createdAt" | "updatedAt">) {
        this.id = id;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

@ObjectType()
export class UserResponse implements User {
    @Field() id?: string;
    @Field() firstname: string;
    @Field() middleName?: string;
    @Field() lastname: string;
    @Field() secondLastname: string;
    @Field() jobCountry: JobCountry;
    @Field() identificationType: IdentificationType;
    @Field() identificationNumber: string;
    @Field() email: string;
    @Field() entryAt: Date;
    @Field() createdAt: Date;
    @Field() updatedAt: Date;
    @Field() area: JobArea;
    @Field() active: boolean;

    constructor(user: User) {
        this.id = user.id;
        this.firstname = user.firstname;
        this.middleName = user.middleName;
        this.lastname = user.lastname;
        this.secondLastname = user.secondLastname;
        this.jobCountry = user.jobCountry;
        this.identificationType = user.identificationType;
        this.identificationNumber = user.identificationNumber;
        this.email = user.email;
        this.entryAt = user.entryAt;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.area = user.area;
        this.active = user.active;
    }
}

@ObjectType()
export class UserPaginatedResponse extends PaginationResponse<User>(
    UserResponse
) {}
