import DateUtils from './index';

describe('DateUtils', () => {
    describe('convertDateToISOString', () => {
        it('should convert a Date object to an ISO string', () => {
            const date = new Date('2025-02-13T12:00:00Z');
            const result = DateUtils.convertDateToISOString(date);
            expect(result).toBe('2025-02-13T12:00:00.000Z');
        });

        it('should return null if the input is null', () => {
            const result = DateUtils.convertDateToISOString(null);
            expect(result).toBeNull();
        });
    });

    describe('getCurrentDateISOString', () => {
        it('should return the current date as an ISO string', () => {
            const mockDate = new Date('2025-02-13T12:00:00Z');
            jest.spyOn(global, 'Date').mockImplementation(() => mockDate);
            const result = DateUtils.getCurrentDateISOString();
            expect(result).toBe('2025-02-13T12:00:00.000Z');
            jest.restoreAllMocks();
        });
    });

    describe('convertDatesToISOStrings', () => {
        it('should convert Date properties in an object to ISO strings', () => {
            const input = {
                name: 'Test',
                date: new Date('2025-02-13T12:00:00Z'),
                nested: {
                    date: new Date('2025-02-14T12:00:00Z'),
                },
            };
            const expected = {
                name: 'Test',
                date: '2025-02-13T12:00:00.000Z',
                nested: {
                    date: '2025-02-14T12:00:00.000Z',
                },
            };
            const result = DateUtils.convertDatesToISOStrings(input);
            expect(result).toEqual(expected);
        });

        it('should handle arrays of objects with Date properties', () => {
            const input = [{ date: new Date('2025-02-13T12:00:00Z') }, { date: new Date('2025-02-14T12:00:00Z') }];
            const expected = [{ date: '2025-02-13T12:00:00.000Z' }, { date: '2025-02-14T12:00:00.000Z' }];
            const result = DateUtils.convertDatesToISOStrings(input);
            expect(result).toEqual(expected);
        });

        it('should return primitives unchanged', () => {
            const input = 'test string';
            const result = DateUtils.convertDatesToISOStrings(input);
            expect(result).toBe(input);
        });

        it('should return null and undefined unchanged', () => {
            expect(DateUtils.convertDatesToISOStrings(null)).toBeNull();
            expect(DateUtils.convertDatesToISOStrings(undefined)).toBeUndefined();
        });
    });
});
