export class TimeEntryNotFoundError extends Error {
    constructor(message: string = 'Time entry not found') {
        super(message);
        this.name = 'TimeEntryNotFoundError';
    }
}
