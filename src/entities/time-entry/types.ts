export interface TimeEntry {
    id: string;
    userId: string;
    description: string;
    startTime: string;
    endTime: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export type CreateTimeEntry = Pick<TimeEntry, 'userId' | 'description' | 'startTime'>;
export type UpdateTimeEntry = Partial<Pick<TimeEntry, 'userId' | 'description' | 'startTime' | 'endTime'>> &
    Pick<TimeEntry, 'userId'>;
