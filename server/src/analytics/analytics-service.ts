import mongoose from 'mongoose';
import DataModel from "../data/data-model";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, addMonths, isAfter, subDays } from "date-fns";
import { SimpleLinearRegression } from "ml-regression-simple-linear";

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

      const userIdAdmin = await userService.isAdmin(userId);
      if (!userIdAdmin && userId) filter.user = new mongoose.Types.ObjectId(userId);
      if (!userIdAdmin && objectId) filter.object = new mongoose.Types.ObjectId(objectId);

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

      const isAdmin = await userService.isAdmin(userId);
      if (!isAdmin && userId) filter.user = new mongoose.Types.ObjectId(userId);
      if (!isAdmin && objectId) filter.object = new mongoose.Types.ObjectId(objectId);

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

        const isAmin = await userService.isAdmin(userId);
        if (!isAmin && userId) filter.user = new mongoose.Types.ObjectId(userId);
        if (!isAmin && objectId) filter.object = new mongoose.Types.ObjectId(objectId);

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

  async generateRegression(userId: string, objectId: string) {
    const convertedUserId = new mongoose.Types.ObjectId(userId);
    const convertedObjectId = new mongoose.Types.ObjectId(objectId);

    // Отримуємо всі записи користувача по обʼєкту, впорядковані за датою
    const dataPoints = await DataModel.find({
        user: convertedUserId,
        object: convertedObjectId
    }).sort({ date: 1 });

    if (dataPoints.length < 2) {
        throw new Error("Недостатньо даних для прогнозу.");
    }

    // x — порядковий номер (час), y — amount
    const x = dataPoints.map((_, i) => i);
    const y = dataPoints.map(dp => dp.amount);

    const regression = new SimpleLinearRegression(x, y);

    // Прогноз на наступний період
    const nextIndex = dataPoints.length;
    const prediction = regression.predict(nextIndex);

    return {
        prediction: Number(prediction.toFixed(2)),
        slope: Number(regression.slope.toFixed(4)),
        intercept: Number(regression.intercept.toFixed(2)),
    };
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


async getOptimizationTips(userId: string, objectId: string) {
  const data = await DataModel.find({ user: userId, object: objectId });
  const currentObject = await ObjectModel.findById(objectId);
  const similarObjects = await ObjectModel.find({ type: currentObject.type, _id: { $ne: objectId } });

  const similarData = await DataModel.find({
      object: { $in: similarObjects.map(obj => obj._id) }
  });

  // Обчислення середніх значень по категоріях
  const tips: string[] = [];
  const categories = Object.values(ConsumptionCategory);
  
  for (const category of categories) {
      const userCatData = data.filter(d => d.category === category);
      const avgUser = userCatData.reduce((sum, d) => sum + d.amount, 0) / (userCatData.length || 1);

      const similarCatData = similarData.filter(d => d.category === category);
      const avgSimilar = similarCatData.reduce((sum, d) => sum + d.amount, 0) / (similarCatData.length || 1);

      if (avgUser > avgSimilar * 1.2) {
          tips.push(`Ви витрачаєте більше енергії на ${category}. Розгляньте можливість використання енергоефективних пристроїв або змініть графік користування.`);
      }
  }

  // Проста порада щодо тарифу
  tips.push("Перевірте, чи використовуєте вигідний тарифний план. Деякі постачальники мають дешевші нічні тарифи.");

  return tips;
}

async getHistoricalComparison(userId: string, objectId: string) {
  const now = new Date();
  const past1Day = new Date(now);
  past1Day.setDate(past1Day.getDate() - 1);

  const convertedUserId = new mongoose.Types.ObjectId(userId); 
  const convertedObjectId = new mongoose.Types.ObjectId(objectId);

  const recentData = await DataModel.find({
      user: convertedUserId,
      object: convertedObjectId,
      date: { $gte: past1Day, $lte: now }
  });

  const historicalData = await DataModel.find({
      user: convertedUserId,
      object: convertedObjectId,
      date: { $lt: past1Day }
  });

  const avgRecent = recentData.reduce((sum, d) => sum + d.amount, 0) / (recentData.length || 1);
  const avgHistorical = historicalData.reduce((sum, d) => sum + d.amount, 0) / (historicalData.length || 1);

  const status = avgRecent > avgHistorical
      ? "вище"
      : avgRecent < avgHistorical
          ? "нижче"
          : "на тому ж рівні";

  return {
      recentAverage: avgRecent,
      historicalAverage: avgHistorical,
      status
  };
}

async checkDailyLimit(objectId: string) {
  const object: Object = await ObjectModel.findById(objectId);
  if (!object || !object.limit) return;

  console.log(object);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const data = await DataModel.find({
      object: new mongoose.Types.ObjectId(objectId),
      date: { $gte: startOfDay, $lte: endOfDay }
  });

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  if (totalAmount > object.limit) {
    const tips = await this.getOptimizationTips(object.owner._id.toString(), objectId);
    await notificationService.createLimitExceededNotification(object.owner.toString(), objectId, totalAmount, object.limit, tips);
  }
}


}

const analyticService = new AnalyticsService();
import bindAll from "../helpers/bind-all";
import { analyticsCredentials, AnalyticsResponse, CategorisedAnalyticsResponse } from "./analytics-types";
import Data, { ConsumptionCategory } from '../data/data-types';
import { DateModule } from '@faker-js/faker/.';
import notificationService from '../notifications/notification-service';
import ObjectModel from '../object/object-model';
import Object from '../object/object-types';
import userService from '../user/user-service';
import { sendEmail } from '../../email/email-service';
bindAll(analyticService);
export default analyticService;
