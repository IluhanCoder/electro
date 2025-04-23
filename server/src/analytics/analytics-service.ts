import mongoose from 'mongoose';
import DataModel from "../data/data-model";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, addMonths, isAfter } from "date-fns";



class AnalyticsService {
  async calculateAmount({
    startDate,
    endDate,
    daily,
    userId,
    objectId
  }: analyticsCredentials): Promise<AnalyticsResponse[]> {

    const result: AnalyticsResponse[] = [];

    const current = new Date(startDate);
    console.log(current);
    console.log(endDate);
    console.log(new Date(current).getTime() <= new Date(endDate).getTime());

    while (new Date(current).getTime() <= new Date(endDate).getTime()) {
      let from: Date, to: Date;

      if (daily) {
        from = startOfDay(current);
        to = endOfDay(current);
      } else {
        from = startOfMonth(current);
        to = endOfMonth(current);
      }

      const filter: any = {
        date: { $gte: from, $lte: to }
      };

      if (userId) filter.user = new mongoose.Types.ObjectId(userId);
      if (objectId) filter.object = new mongoose.Types.ObjectId(objectId);

      const docs = await DataModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      const amount = docs.length > 0 ? docs[0].total : 0;

      result.push({
        ...(daily ? { day: current.getDate() } : {}),
        month: current.getMonth() + 1,
        amount
      });

      current.setDate(current.getDate() + (daily ? 1 : 32));
      if (!daily) current.setDate(1); // після 32 – наступне число в місяці, скидаємо на 1
    }

    return result;
  }

  async calculateMonthAverage({
    startDate,
    endDate,
    userId,
    objectId
  }: Omit<analyticsCredentials, "daily">): Promise<AnalyticsResponse[]> {
    const result: AnalyticsResponse[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const from = startOfMonth(current);
      const to = endOfMonth(current);

      const filter: any = {
        date: { $gte: from, $lte: to }
      };

      if (userId) filter.user = userId;
      if (objectId) filter.object = objectId;

      const docs = await DataModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      const average = docs.length > 0 ? docs[0].total / docs[0].count : 0;

      result.push({
        month: current.getMonth() + 1,
        amount: average
      });

      current.setMonth(current.getMonth() + 1);
    }

    return result;
  }
}

const analyticService = new AnalyticsService();
import bindAll from "../helpers/bind-all";
import { analyticsCredentials, AnalyticsResponse } from "./analytics-types";
bindAll(analyticService);
export default analyticService;
