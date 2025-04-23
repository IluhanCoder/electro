"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const analytics_service_1 = __importDefault(require("./analytics-service"));
class AnalyticsController {
    caclulateAmount(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                const analytics = yield analytics_service_1.default.calculateAmount(credentials);
                return res.status(200).json({ analytics, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    calculateAmountCategorised(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                const analytics = yield analytics_service_1.default.calculateAmountCategorised(credentials);
                return res.status(200).json({ analytics, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    caclulateAverage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credentials } = req.body;
                const analytics = yield analytics_service_1.default.calculateAverage(credentials);
                return res.status(200).json({ analytics, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    heatmapPeakLoad(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { objectId, startDate, endDate } = req.body.credentials;
                const result = yield analytics_service_1.default.getPeakLoadHeatmap({
                    objectId,
                    startDate,
                    endDate
                });
                res.status(200).json({ data: result, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const analyticsController = new AnalyticsController();
(0, bind_all_1.default)(analyticsController);
exports.default = analyticsController;
//# sourceMappingURL=analytics-controller.js.map