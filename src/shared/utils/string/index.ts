class StringUtils {
    static toSnakeCase(str: string): string {
        return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`).replace(/^_/, '');
    }

    static toCamelCase(str: string): string {
        return str.replace(/_([a-z0-9])/g, (match, letter) => letter.toUpperCase());
    }
}

export default StringUtils;
