import mongoose from 'mongoose';
import DataModel from "../data/data-model";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, addMonths, isAfter, subDays } from "date-fns";

export interface HeatmapCredentials {
  objectId: string;
  startDate: Date;
  endDate: Date;
}

class AnalyticsService {
  intervalSeconds = 20;

  async calculateAmount({
    startDate,
    endDate,
    daily,
    userId,
    objectId
  }: analyticsCredentials): Promise<AnalyticsResponse[]> {
    const intervalSeconds = this.intervalSeconds;

    const result: AnalyticsResponse[] = [];
    const current = new Date(startDate);

    while (current <= new Date(endDate)) {
      let from: Date, to: Date;

      if (daily) {
        from = startOfDay(current);
        to = endOfDay(current);
      } else {
        from = new Date(current);
        to = new Date(current.getTime() + intervalSeconds * 1000);
      }

      const filter: any = {
        date: { $gte: from, $lte: to }
      };

      if (userId) filter.user = new mongoose.Types.ObjectId(userId);
      if (objectId) filter.object = new mongoose.Types.ObjectId(objectId);

      console.log(filter);

      const docs = await DataModel.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" }
          }
        }
      ]);

      console.log(docs);

      const amount = docs.length > 0 ? docs[0].total : 0;

      result.push({
        ...(daily
          ? { day: current.getDate() }
          : {
            hour: current.getHours(),
            minute: current.getMinutes(),
            second: current.getSeconds(),
            day: current.getDate()
          }),
        month: current.getMonth() + 1,
        amount
      });

      if (daily) {
        current.setDate(current.getDate() + 1);
      } else {
        current.setSeconds(current.getSeconds() + intervalSeconds);
      }
    }

    return result;
  }

  async calculateAverage({
    startDate,
    endDate,
    userId,
    objectId,
    daily
  }: analyticsCredentials): Promise<AnalyticsResponse[]> {
    const result: AnalyticsResponse[] = [];
    const current = new Date(startDate);

    while (current <= new Date(endDate)) {
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
            total: { $sum: "$amount" },
            count: { $sum: 1 }
          }
        }
      ]);

      const average = docs.length > 0 ? docs[0].total / docs[0].count : 0;

      result.push({
        day: current.getDate(),
        month: current.getMonth() + 1,
        amount: average
      });

      if (daily) {
        current.setDate(current.getDate() + 1);
      } else {
        current.setMonth(current.getMonth() + 1);
      }
    }

    return result;
  }

  async calculateAmountCategorised({
    startDate,
    endDate,
    daily,
    userId,
    objectId
  }: analyticsCredentials): Promise<CategorisedAnalyticsResponse[]> {
    const intervalSeconds = this.intervalSeconds;
    const result: CategorisedAnalyticsResponse[] = [];
    const current = new Date(startDate);
    const categories = Object.values(ConsumptionCategory);

    while (current <= new Date(endDate)) {
      let from: Date, to: Date;

      if (daily) {
        from = startOfDay(current);
        to = endOfDay(current);
      } else {
        from = new Date(current);
        to = new Date(current.getTime() + intervalSeconds * 1000);
      }

      const entry: CategorisedAnalyticsResponse = {
        ...(daily
          ? {}
          : {
            hour: current.getHours(),
            minute: current.getMinutes(),
            second: current.getSeconds(),
          }),
        day: current.getDate(),
        month: current.getMonth() + 1,
        heating: 0,
        lighting: 0,
        household: 0,
        media: 0
      };

      for (const category of categories) {
        const filter: any = {
          date: { $gte: from, $lte: to },
          category
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
        entry[category as keyof Omit<CategorisedAnalyticsResponse, "hour" | "minute" | "second" | "day" | "month">] = amount;
      }

      result.push(entry);

      if (daily) {
        current.setDate(current.getDate() + 1);
      } else {
        current.setSeconds(current.getSeconds() + intervalSeconds);
      }
    }

    return result;
  }



  async getPeakLoadHeatmap(credentials: HeatmapCredentials) {
    const { objectId, startDate, endDate } = credentials;

    const result = await DataModel.aggregate([
      {
        $match: {
          object: new mongoose.Types.ObjectId(objectId),
          date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $project: {
          hour: { $hour: "$date" },
          weekday: { $dayOfWeek: "$date" }, // 1 = неділя, 7 = субота
          amount: 1
        }
      },
      {
        $group: {
          _id: {
            hour: "$hour",
            weekday: { $subtract: ["$weekday", 1] } // зробимо 0 = неділя, 6 = субота
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      {
        $project: {
          hour: "$_id.hour",
          weekday: "$_id.weekday",
          totalAmount: 1,
          _id: 0
        }
      },
      {
        $sort: { weekday: 1, hour: 1 }
      }
    ]);

    return result;
  }

  async checkAndNotifyAnomalies(objectId: string) {
    const endDate = new Date();
    const startDate = subDays(endDate, 7);

    const records: Data[] = (await DataModel.find({
        object: new mongoose.Types.ObjectId(objectId),
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 })) as unknown as Data[];

    if (records.length < 2) return; // Мусимо мати принаймні 1 попереднє + останнє

    const lastRecord = records[0];
    const previousRecords = records.slice(1);

    const avg = previousRecords.reduce((sum, r) => sum + r.amount, 0) / previousRecords.length;
    const diff = lastRecord.amount - avg;

    const userId = lastRecord.user;

    if (diff > avg * 0.5 && diff <= avg * 1.5) {
        await notificationService.createNotification(userId, `Споживання підвищено: ${lastRecord.amount} КВт/год, середнє: ${avg.toFixed(1)} КВт/год.`);
    } else if (diff > avg * 1.5) {
        await notificationService.createNotification(userId, `⚠️ АНОМАЛІЯ: Різке підвищення споживання до ${lastRecord.amount} КВт/год. Середнє: ${avg.toFixed(1)} КВт/год.`);
    }
}

}

const analyticService = new AnalyticsService();
import bindAll from "../helpers/bind-all";
import { analyticsCredentials, AnalyticsResponse, CategorisedAnalyticsResponse } from "./analytics-types";
import Data, { ConsumptionCategory } from '../data/data-types';
import { DateModule } from '@faker-js/faker/.';
import notificationService from '../notifications/notification-service';
bindAll(analyticService);
export default analyticService;
