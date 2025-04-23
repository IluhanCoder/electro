export interface analyticsCredentials {
    startDate: Date;
    endDate: Date;
    daily: boolean;
    userId?: string;
    objectId?: string;
}
  
export interface AnalyticsResponse {
    second?: number;
    minute?: number;
    hour?: number;
    day: number;
    month: number;
    amount: number;
}