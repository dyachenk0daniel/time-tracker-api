export interface TimeEntry {
    id: string;
    userId: string;
    description: string;
    startTime: string;
    endTime: string | null;
    createdAt: string;
    updatedAt: string | null;
}

export type CreateTimeEntry = Pick<TimeEntry, 'userId' | 'description' | 'startTime' | 'endTime'>;
export type UpdateTimeEntry = Partial<CreateTimeEntry> & Pick<TimeEntry, 'userId'>;
