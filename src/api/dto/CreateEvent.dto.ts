export interface CreateEventDto {
    description: string;
    user_id?: string;
    type: number;
    date: Date;
}