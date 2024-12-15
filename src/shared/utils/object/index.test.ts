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
});
