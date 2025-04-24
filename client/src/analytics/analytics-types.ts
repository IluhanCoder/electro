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

export interface CategorisedAnalyticsResponse {
    second?: number;
    minute?: number;
    hour?: number;
    day: number;
    month: number;
    heating: number,
    lighting: number,
    household: number,
    media: number
}


export interface HeatmapCredentials {
    objectId: string;
    startDate: Date;
    endDate: Date;
  }