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
    constructor() {
        this.intervalSeconds = 20;
    }
    calculateAmount(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, daily, userId, objectId }) {
            const intervalSeconds = this.intervalSeconds;
            const result = [];
            const current = new Date(startDate);
            while (current <= new Date(endDate)) {
                let from, to;
                if (daily) {
                    from = (0, date_fns_1.startOfDay)(current);
                    to = (0, date_fns_1.endOfDay)(current);
                }
                else {
                    from = new Date(current);
                    to = new Date(current.getTime() + intervalSeconds * 1000);
                }
                const filter = {
                    date: { $gte: from, $lte: to }
                };
                if (userId)
                    filter.user = new mongoose_1.default.Types.ObjectId(userId);
                if (objectId)
                    filter.object = new mongoose_1.default.Types.ObjectId(objectId);
                console.log(filter);
                const docs = yield data_model_1.default.aggregate([
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
                result.push(Object.assign(Object.assign({}, (daily
                    ? { day: current.getDate() }
                    : {
                        hour: current.getHours(),
                        minute: current.getMinutes(),
                        second: current.getSeconds(),
                        day: current.getDate()
                    })), { month: current.getMonth() + 1, amount }));
                if (daily) {
                    current.setDate(current.getDate() + 1);
                }
                else {
                    current.setSeconds(current.getSeconds() + intervalSeconds);
                }
            }
            return result;
        });
    }
    calculateAverage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, userId, objectId, daily }) {
            const result = [];
            const current = new Date(startDate);
            while (current <= new Date(endDate)) {
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
                }
                else {
                    current.setMonth(current.getMonth() + 1);
                }
            }
            return result;
        });
    }
    calculateAmountCategorised(_a) {
        return __awaiter(this, arguments, void 0, function* ({ startDate, endDate, daily, userId, objectId }) {
            const intervalSeconds = this.intervalSeconds;
            const result = [];
            const current = new Date(startDate);
            const categories = Object.values(data_types_1.ConsumptionCategory);
            while (current <= new Date(endDate)) {
                let from, to;
                if (daily) {
                    from = (0, date_fns_1.startOfDay)(current);
                    to = (0, date_fns_1.endOfDay)(current);
                }
                else {
                    from = new Date(current);
                    to = new Date(current.getTime() + intervalSeconds * 1000);
                }
                const entry = Object.assign(Object.assign({}, (daily
                    ? {}
                    : {
                        hour: current.getHours(),
                        minute: current.getMinutes(),
                        second: current.getSeconds(),
                    })), { day: current.getDate(), month: current.getMonth() + 1, heating: 0, lighting: 0, household: 0, media: 0 });
                for (const category of categories) {
                    const filter = {
                        date: { $gte: from, $lte: to },
                        category
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
                    entry[category] = amount;
                }
                result.push(entry);
                if (daily) {
                    current.setDate(current.getDate() + 1);
                }
                else {
                    current.setSeconds(current.getSeconds() + intervalSeconds);
                }
            }
            return result;
        });
    }
    getPeakLoadHeatmap(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const { objectId, startDate, endDate } = credentials;
            const result = yield data_model_1.default.aggregate([
                {
                    $match: {
                        object: new mongoose_1.default.Types.ObjectId(objectId),
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
        });
    }
    detectAnomalies(objectId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const [currentAmountResult] = yield data_model_1.default.aggregate([
                {
                    $match: {
                        object: new mongoose_1.default.Types.ObjectId(objectId),
                        date: { $gte: oneHourAgo }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$amount" }
                    }
                }
            ]);
            const [averageAmountResult] = yield data_model_1.default.aggregate([
                {
                    $match: {
                        object: new mongoose_1.default.Types.ObjectId(objectId),
                        date: { $gte: sevenDaysAgo, $lt: oneHourAgo }
                    }
                },
                {
                    $group: {
                        _id: { day: { $dayOfYear: "$date" } },
                        total: { $sum: "$amount" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        avg: { $avg: "$total" }
                    }
                }
            ]);
            const currentAmount = (currentAmountResult === null || currentAmountResult === void 0 ? void 0 : currentAmountResult.total) || 0;
            const averageAmount = (averageAmountResult === null || averageAmountResult === void 0 ? void 0 : averageAmountResult.avg) || 0;
            if (averageAmount > 0 && currentAmount > averageAmount * 1.5) {
                yield notification_service_1.default.createNotification(new mongoose_1.default.Types.ObjectId(userId), `Виявлено аномальне споживання: ${currentAmount.toFixed(2)} (в середньому ${averageAmount.toFixed(2)})`);
            }
        });
    }
}
const analyticService = new AnalyticsService();
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const data_types_1 = require("../data/data-types");
const notification_service_1 = __importDefault(require("../notifications/notification-service"));
(0, bind_all_1.default)(analyticService);
exports.default = analyticService;
//# sourceMappingURL=analytics-service.js.map