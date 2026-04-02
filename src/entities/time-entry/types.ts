export interface TimeEntry {
    id: string;
    groupId: string;
    description: string;
    startTime: string;
    endTime: string | null;
}

export interface TimeEntryGroup {
    id: string;
    userId: string;
    description: string;
    entriesCount: number;
    entry: TimeEntry | null;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
}