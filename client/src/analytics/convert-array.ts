import { AnalyticsResponse } from "./analytics-types";

export function convertArray(inputArray: AnalyticsResponse[]) {
    return inputArray.map((value: AnalyticsResponse) => ({
      name: `${value.day ? `${value.day}/`:""}${value.month}}`,
      uv: value.amount
    }));
}