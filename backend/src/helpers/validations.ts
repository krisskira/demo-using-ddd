import { minDate } from "class-validator";

export function entryAtValidation(value: Date): boolean {
    const now = new Date();
    const dateLimit = new Date().setMonth(now.getMonth() - 1);
    const lessThanNow = value.getTime() < now.getTime();
    const greaterThanDateLimit = value.getTime() > dateLimit;
    return lessThanNow && greaterThanDateLimit;
}

export function getBeforeMonthDate(now = new Date()): Date {
    const beforeMonth = now.getMonth() - 1;
    const beforeMonthTimestamp = new Date().setMonth(beforeMonth)
    return new Date(beforeMonthTimestamp);
}