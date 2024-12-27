import ObjectUtils from './index';

describe('ObjectUtils', () => {
    describe('omit', () => {
        it('should remove specified keys from the object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.omit(obj, ['b', 'c']);

            expect(result).toEqual({ a: 1 });
        });

        it('should return the same object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.omit(obj, []);

            expect(result).toEqual(obj);
        });

        it('should not mutate the original object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.omit(obj, ['b']);

            expect(result).toEqual({ a: 1, c: 3 });
            expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        });
    });

    describe('pick', () => {
        it('should return only the specified keys from the object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.pick(obj, ['a', 'c']);

            expect(result).toEqual({ a: 1, c: 3 });
        });

        it('should return an empty object if no keys are specified', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.pick(obj, []);

            expect(result).toEqual({});
        });

        it('should return the same object when all keys are selected', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.pick(obj, ['a', 'b', 'c']);

            expect(result).toEqual(obj);
        });

        it('should not mutate the original object', () => {
            const obj = { a: 1, b: 2, c: 3 };
            const result = ObjectUtils.pick(obj, ['a']);

            expect(result).toEqual({ a: 1 });
            expect(obj).toEqual({ a: 1, b: 2, c: 3 });
        });
    });
});
