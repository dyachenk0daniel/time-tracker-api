class DateUtils {
    static convertDateToISOString(date: Date | null): string | null {
        if (date instanceof Date) {
            return date.toISOString();
        }

        return null;
    }
}

export default DateUtils;