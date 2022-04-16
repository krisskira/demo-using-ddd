export function ObjectDeleteUndefinedValues<T>(object: T): Partial<T> {
    return Object.keys(object).reduce((acc, key) => {
        // @ts-ignore
        const value = object?.[key];
        if (value === null || value === undefined) {
            return acc;
        }
        return {
            ...acc,
            [key]: value,
        };
    }, {});
}
