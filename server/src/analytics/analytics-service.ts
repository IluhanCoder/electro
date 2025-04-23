import mongoose from 'mongoose';
import DataModel from "../data/data-model";
import { startOfDay, endOfDay, startOfMonth, endOfMonth, addDays, addMonths, isAfter } from "date-fns";



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
      
      
}

const analyticService = new AnalyticsService();
import bindAll from "../helpers/bind-all";
import { analyticsCredentials, AnalyticsResponse, CategorisedAnalyticsResponse } from "./analytics-types";
import { ConsumptionCategory } from '../data/data-types';
bindAll(analyticService);
export default analyticService;
