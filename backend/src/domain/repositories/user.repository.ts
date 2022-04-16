import mongoose from "mongoose";
import {
    REGEX_EMAIL,
    REGEX_LETTERS_AND_SPACE_UPPER_CASE,
    REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE,
    REGEX_LETTERS_UPPER_CASE,
} from "../../helpers/regex";
import { entryAtValidation } from "../../helpers/validations";
import {
    IdentificationType,
    JobCountry,
    User,
    JobArea,
} from "../../domain/entities";
import { BaseRepository } from "./";

export class UserRepository extends BaseRepository<User> {
    constructor() {
        const userSchema = new mongoose.Schema<User>(
            {
                firstname: {
                    type: String,
                    required: true,
                    maxlength: 20,
                    uppercase: true,
                    match: REGEX_LETTERS_UPPER_CASE,
                },
                middleName: {
                    type: String,
                    required: true,
                    maxlength: 50,
                    uppercase: true,
                    match: REGEX_LETTERS_AND_SPACE_UPPER_CASE,
                },
                lastname: {
                    type: String,
                    required: true,
                    maxlength: 20,
                    uppercase: true,
                    match: REGEX_LETTERS_UPPER_CASE,
                },
                secondLastname: {
                    type: String,
                    required: true,
                    maxlength: 20,
                    uppercase: true,
                    match: REGEX_LETTERS_UPPER_CASE,
                },
                identificationType: {
                    type: String,
                    required: true,
                    enum: Object.values(IdentificationType),
                },
                identificationNumber: {
                    type: String,
                    required: true,
                    unique: true,
                    match: REGEX_LETTERS_NUMBERS_AND_DASH_IGNORE_CASE,
                },
                entryAt: {
                    type: Date,
                    required: true,
                    validate: {
                        validator: entryAtValidation,
                    },
                },
                area: {
                    type: String,
                    required: true,
                    enum: Object.values(JobArea),
                },
                jobCountry: {
                    type: String,
                    required: true,
                    enum: Object.values(JobCountry),
                },
                email: {
                    type: String,
                    required: true,
                    unique: true,
                    maxlength: 50,
                    lowercase: true,
                    match: REGEX_EMAIL,
                },
                active: {
                    type: Boolean,
                    default: true,
                },
            },
            {
                timestamps: true,
                versionKey: false,
            }
        );
        userSchema
            .virtual("id")
            .get(function (this: { _id: mongoose.Types.ObjectId }) {
                return this._id.toString();
            });
        const userModel = mongoose.model("User", userSchema, "users");
        super(UserRepository.name, userModel);
    }
}
