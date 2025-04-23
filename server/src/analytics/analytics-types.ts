export interface analyticsCredentials {
    startDate: Date;
    endDate: Date;
    daily: boolean;
    userId?: string;
    objectId?: string;
}
  
export interface AnalyticsResponse {
    day?: number;
    month: number;
    amount: number;
}