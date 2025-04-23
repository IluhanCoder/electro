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
const mongoose_1 = __importDefault(require("mongoose"));
const data_model_1 = __importDefault(require("../data/data-model"));
const date_fns_1 = require("date-fns");
class AnalyticsService {
    calculateAmount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, daily, userId, objectId }) {
            const result = [];
            const current = new Date(startDate);
            console.log(current);
            console.log(endDate);
            console.log(new Date(current).getTime() <= new Date(endDate).getTime());
            while (new Date(current).getTime() <= new Date(endDate).getTime()) {
                let from, to;
                if (daily) {
                    from = (0, date_fns_1.startOfDay)(current);
                    to = (0, date_fns_1.endOfDay)(current);
                }
                else {
                    from = (0, date_fns_1.startOfMonth)(current);
                    to = (0, date_fns_1.endOfMonth)(current);
                }
                const filter = {
                    date: { $gte: from, $lte: to }
                };
                if (userId)
                    filter.user = new mongoose_1.default.Types.ObjectId(userId);
                if (objectId)
                    filter.object = new mongoose_1.default.Types.ObjectId(objectId);
                const docs = yield data_model_1.default.aggregate([
                    { $match: filter },
                    {
                        $group: {
                            _id: null,
                            total: { $sum: "$amount" }
                        }
                    }
                ]);
                const amount = docs.length > 0 ? docs[0].total : 0;
                result.push(Object.assign(Object.assign({}, (daily ? { day: current.getDate() } : {})), { month: current.getMonth() + 1, amount }));
                current.setDate(current.getDate() + (daily ? 1 : 32));
                if (!daily)
                    current.setDate(1); // після 32 – наступне число в місяці, скидаємо на 1
            }
            return result;
        });
    }
    calculateMonthAverage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, userId, objectId }) {
            const result = [];
            const current = new Date(startDate);
            while (current <= endDate) {
                const from = (0, date_fns_1.startOfMonth)(current);
                const to = (0, date_fns_1.endOfMonth)(current);
                const filter = {
                    date: { $gte: from, $lte: to }
                };
                if (userId)
                    filter.user = userId;
                if (objectId)
                    filter.object = objectId;
                const docs = yield data_model_1.default.aggregate([
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
        });
    }
}
const analyticService = new AnalyticsService();
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
(0, bind_all_1.default)(analyticService);
exports.default = analyticService;
//# sourceMappingURL=analytics-service.js.map