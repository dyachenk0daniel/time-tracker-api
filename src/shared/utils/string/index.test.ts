import StringUtils from './index';

describe('StringUtils', () => {
    describe('toSnakeCase', () => {
        it('should convert camelCase to snake_case', () => {
            const result = StringUtils.toSnakeCase('someCamelCaseString');
            expect(result).toBe('some_camel_case_string');
        });

        it('should handle single word string', () => {
            const result = StringUtils.toSnakeCase('word');
            expect(result).toBe('word');
        });

        it('should handle string starting with uppercase', () => {
            const result = StringUtils.toSnakeCase('CamelCase');
            expect(result).toBe('camel_case');
        });

        it('should handle string with multiple words', () => {
            const result = StringUtils.toSnakeCase('SomeExampleWithMultipleWords');
            expect(result).toBe('some_example_with_multiple_words');
        });

        it('should handle an already snake_case string', () => {
            const result = StringUtils.toSnakeCase('already_snake_case');
            expect(result).toBe('already_snake_case');
        });

        it('should return an empty string when given an empty string', () => {
            const result = StringUtils.toSnakeCase('');
            expect(result).toBe('');
        });

        it('should handle string with numbers', () => {
            const result = StringUtils.toSnakeCase('someCamelCase123');
            expect(result).toBe('some_camel_case123');
        });
    });

    describe('toCamelCase', () => {
        it('should convert snake_case to camelCase', () => {
            const result = StringUtils.toCamelCase('some_snake_case_string');
            expect(result).toBe('someSnakeCaseString');
        });

        it('should handle single word string', () => {
            const result = StringUtils.toCamelCase('word');
            expect(result).toBe('word');
        });

        it('should handle string with multiple words', () => {
            const result = StringUtils.toCamelCase('some_example_with_multiple_words');
            expect(result).toBe('someExampleWithMultipleWords');
        });

        it('should handle string starting with lowercase', () => {
            const result = StringUtils.toCamelCase('some_example');
            expect(result).toBe('someExample');
        });

        it('should handle string with numbers', () => {
            const result = StringUtils.toCamelCase('some_example_123_string');
            expect(result).toBe('someExample123String');
        });

        it('should return an empty string when given an empty string', () => {
            const result = StringUtils.toCamelCase('');
            expect(result).toBe('');
        });

        it('should not change already camelCase string', () => {
            const result = StringUtils.toCamelCase('alreadyCamelCase');
            expect(result).toBe('alreadyCamelCase');
        });
    });

    describe('generateUUID', () => {
        it('should generate a valid UUID', () => {
            const mockUUID = '123e4567-e89b-12d3-a456-426614174000';

            jest.spyOn(global.crypto, 'randomUUID').mockReturnValue(mockUUID);

            const result = StringUtils.generateUUID();

            expect(result).toBe(mockUUID);

            jest.restoreAllMocks();
        });
    });
});
