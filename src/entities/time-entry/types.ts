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
}