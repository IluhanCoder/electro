import { NextFunction, Request, Response } from "express";
import bindAll from "../helpers/bind-all";
import { analyticsCredentials } from "./analytics-types";
import analyticService from "./analytics-service";

class AnalyticsController {
    async caclulateAmount(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: analyticsCredentials};
            const analytics = await analyticService.calculateAmount(credentials);
            return res.status(200).json({analytics, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async calculateAmountCategorised(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: analyticsCredentials};
            const analytics = await analyticService.calculateAmountCategorised(credentials);
            return res.status(200).json({analytics, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async caclulateAverage(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: analyticsCredentials};
            const analytics = await analyticService.calculateAverage(credentials);
            return res.status(200).json({analytics, message: "success"});
        } catch (error) {
            next(error);
        }
    }

    async heatmapPeakLoad(req: Request, res: Response, next: NextFunction) {
        try {
          const { objectId, startDate, endDate } = req.body.credentials;
      
          const result = await analyticService.getPeakLoadHeatmap({
            objectId,
            startDate,
            endDate
          });
      
          res.status(200).json({ data: result, message: "success" });
        } catch (error) {
          next(error);
        }
      }
      
      async generateRegression(req: Request, res: Response) {
        try {
            const { userId, objectId } = req.body;
            const result = await analyticService.generateRegression(userId, objectId);
            res.json({ prediction: result.prediction, slope: result.slope, intercept: result.intercept });
        } catch (error: any) {
            res.status(400).json({ message: error.message || "Помилка під час генерації прогнозу" });
        }
    }

    async getOptimizationTips(req: Request, res: Response) {
        const { userId, objectId } = req.body;
        const tips = await analyticService.getOptimizationTips(userId, objectId);
        res.json({ message: "Ось ваші поради", tips });
    }

    async getHistoricalComparison(req: Request, res: Response) {
        const { userId, objectId } = req.body;
        const result = await analyticService.getHistoricalComparison(userId, objectId);
        res.json(result);
    }
    
    
}

const analyticsController = new AnalyticsController();
bindAll(analyticsController);
export default analyticsController;