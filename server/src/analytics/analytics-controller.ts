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

    async caclulateMonthAverage(req: Request, res: Response, next: NextFunction) {
        try {
            const {credentials} = req.body as {credentials: analyticsCredentials};
            const analytics = await analyticService.calculateMonthAverage(credentials);
            return res.status(200).json({analytics, message: "success"});
        } catch (error) {
            next(error);
        }
    }
}

const analyticsController = new AnalyticsController();
bindAll(analyticsController);
export default analyticsController;