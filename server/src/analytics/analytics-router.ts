import { Router } from "express";
import analyticsController from "./analytics-controller";

const analyticsRouter = Router();

analyticsRouter.post("/amount", analyticsController.caclulateAmount);
analyticsRouter.post("/average", analyticsController.caclulateAverage);
analyticsRouter.post("/amount-categorised", analyticsController.calculateAmountCategorised);
analyticsRouter.post("/heatmap", analyticsController.heatmapPeakLoad);
analyticsRouter.post("/regression", analyticsController.generateRegression);
analyticsRouter.post("/optimization-tips", analyticsController.getOptimizationTips);
analyticsRouter.post("/historical-comparison", analyticsController.getHistoricalComparison);

export default analyticsRouter;