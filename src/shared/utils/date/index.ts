type Primitive = string | number | boolean | null | undefined;
type DateToString<T> = T extends Date
    ? string
    : T extends Primitive
      ? T
      : T extends Array<infer U>
        ? Array<DateToString<U>>
        : T extends object
          ? { [K in keyof T]: DateToString<T[K]> }
          : T;

class DateUtils {
    static convertDateToISOString(date: Date | null): string | null {
        if (date instanceof Date) {
            return date.toISOString();
        }

        return null;
    }

    static getCurrentDateISOString(): string {
        return new Date().toISOString();
    }

    static convertDatesToISOStrings<T>(obj: T): DateToString<T> {
        if (obj === null || obj === undefined) {
            return obj as DateToString<T>;
        }

        if (obj instanceof Date) {
            return obj.toISOString() as DateToString<T>;
        }

        if (Array.isArray(obj)) {
            return obj.map((item) => this.convertDatesToISOStrings(item)) as DateToString<T>;
        }

        if (typeof obj === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const result: any = {};

            for (const [key, value] of Object.entries(obj)) {
                result[key] = this.convertDatesToISOStrings(value);
            }

            return result as DateToString<T>;
        }

        return obj as DateToString<T>;
    }
}

export default DateUtils;
