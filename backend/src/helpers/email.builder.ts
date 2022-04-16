import { JobCountry, User } from "../domain/entities";

export function userEmailBuilder(
    user: Pick<User, "firstname" | "lastname" | "jobCountry">,
    id: number
): string {
    const emailDomain = getDomain(user.jobCountry);
    return (
        `${user.firstname}.${user.lastname}`.toLowerCase() +
        `${id >= 0 ? "." + id : ""}${emailDomain}`
    );
}

export function getDomain(jobCountry: JobCountry): string {
    const emailDomain =
        jobCountry === "US" ? "@cidenet.com.us" : "@cidenet.com.co";
    return emailDomain;
}

export function changeEmailDomain(
    email: string,
    jobCountry: JobCountry
): string {
    const emailParts = email.split("@");
    emailParts[1] = getDomain(jobCountry);
    return emailParts.join("");
}
