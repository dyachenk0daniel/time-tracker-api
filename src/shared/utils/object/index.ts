class ObjectUtils {
    static omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
        const result = { ...obj };

        keys.forEach((key) => {
            delete result[key];
        });

        return result;
    }

    static pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        const result = {} as Pick<T, K>;

        keys.forEach((key) => {
            if (key in obj) {
                result[key] = obj[key];
            }
        });

        return result;
    }
}

export default ObjectUtils;
