import { Router } from "express";
import analyticsController from "./analytics-controller";

const analyticsRouter = Router();

analyticsRouter.post("/amount", analyticsController.caclulateAmount);
analyticsRouter.post("/average", analyticsController.caclulateMonthAverage);

export default analyticsRouter;