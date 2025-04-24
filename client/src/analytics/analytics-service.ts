import $api from "../axios";
import { analyticsCredentials, AnalyticsResponse, CategorisedAnalyticsResponse, HeatmapCredentials } from "./analytics-types";

interface analyticsRequestResponse {
    analytics: AnalyticsResponse[],
    message: string
}

interface catAnalyticsRequestResponse {
    analytics: CategorisedAnalyticsResponse[],
    message: string
}

export interface HistoricalComparisonResponse {
    recentAverage: number,
    historicalAverage: number,
    status: "вище" | "нижче" | "на тому ж рівні"
}

export interface HeatmapPoint {
    hour: number;
    weekday: number;
    totalAmount: number;
  }
  
  export interface HeatmapResponse {
    data: HeatmapPoint[];
    message: string;
  }

  interface RegressionResponse {
    prediction: number;
    slope: number;
    intercept: number;
}


export default new class AnalyticsService {
    async calculateAmount(credentials: analyticsCredentials) {
        return ((await $api.post("/analytics/amount", {credentials})).data) as analyticsRequestResponse;
    }

    async calculateAverage(credentials: analyticsCredentials) {
        return ((await $api.post("/analytics/average", {credentials})).data) as analyticsRequestResponse;
    }

    async calculateAmountCategorised(credentials: analyticsCredentials) {
        return ((await $api.post("/analytics/amount-categorised", {credentials})).data) as catAnalyticsRequestResponse;
    }

    async getHeatMap(credentials: HeatmapCredentials) {
        return ((await $api.post("/analytics/heatmap", {credentials})).data) as HeatmapResponse;
    }

    async getRegression(userId: string, objectId: string) {
        return ((await $api.post("/analytics/regression", { userId, objectId })).data) as RegressionResponse;
    }

    async getOptimizationTips(userId: string, objectId: string) {
        return ((await $api.post("/analytics/optimization-tips", { userId, objectId })).data) as {
            tips: string[],
            message: string
        };
    }

    async getHistoricalComparison(userId: string, objectId: string) {
        return ((await $api.post("/analytics/historical-comparison", { userId, objectId })).data) as HistoricalComparisonResponse;
    }
}