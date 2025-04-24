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
const ml_regression_simple_linear_1 = require("ml-regression-simple-linear");
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
                const userIdAdmin = yield user_service_1.default.isAdmin(userId);
                if (!userIdAdmin && userId)
                    filter.user = new mongoose_1.default.Types.ObjectId(userId);
                if (!userIdAdmin && objectId)
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
                const isAdmin = yield user_service_1.default.isAdmin(userId);
                if (!isAdmin && userId)
                    filter.user = new mongoose_1.default.Types.ObjectId(userId);
                if (!isAdmin && objectId)
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
                    const isAmin = yield user_service_1.default.isAdmin(userId);
                    if (!isAmin && userId)
                        filter.user = new mongoose_1.default.Types.ObjectId(userId);
                    if (!isAmin && objectId)
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
    generateRegression(userId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            const convertedObjectId = new mongoose_1.default.Types.ObjectId(objectId);
            // Отримуємо всі записи користувача по обʼєкту, впорядковані за датою
            const dataPoints = yield data_model_1.default.find({
                user: convertedUserId,
                object: convertedObjectId
            }).sort({ date: 1 });
            if (dataPoints.length < 2) {
                throw new Error("Недостатньо даних для прогнозу.");
            }
            // x — порядковий номер (час), y — amount
            const x = dataPoints.map((_, i) => i);
            const y = dataPoints.map(dp => dp.amount);
            const regression = new ml_regression_simple_linear_1.SimpleLinearRegression(x, y);
            // Прогноз на наступний період
            const nextIndex = dataPoints.length;
            const prediction = regression.predict(nextIndex);
            return {
                prediction: Number(prediction.toFixed(2)),
                slope: Number(regression.slope.toFixed(4)),
                intercept: Number(regression.intercept.toFixed(2)),
            };
        });
    }
    checkAndNotifyAnomalies(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const endDate = new Date();
            const startDate = (0, date_fns_1.subDays)(endDate, 7);
            const records = (yield data_model_1.default.find({
                object: new mongoose_1.default.Types.ObjectId(objectId),
                date: { $gte: startDate, $lte: endDate }
            }).sort({ date: -1 }));
            if (records.length < 2)
                return; // Мусимо мати принаймні 1 попереднє + останнє
            const lastRecord = records[0];
            const previousRecords = records.slice(1);
            const avg = previousRecords.reduce((sum, r) => sum + r.amount, 0) / previousRecords.length;
            const diff = lastRecord.amount - avg;
            const userId = lastRecord.user;
            if (diff > avg * 0.5 && diff <= avg * 1.5) {
                yield notification_service_1.default.createNotification(userId, `Споживання підвищено: ${lastRecord.amount} КВт/год, середнє: ${avg.toFixed(1)} КВт/год.`);
            }
            else if (diff > avg * 1.5) {
                yield notification_service_1.default.createNotification(userId, `⚠️ АНОМАЛІЯ: Різке підвищення споживання до ${lastRecord.amount} КВт/год. Середнє: ${avg.toFixed(1)} КВт/год.`);
            }
        });
    }
    getOptimizationTips(userId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield data_model_1.default.find({ user: userId, object: objectId });
            const currentObject = yield object_model_1.default.findById(objectId);
            const similarObjects = yield object_model_1.default.find({ type: currentObject.type, _id: { $ne: objectId } });
            const similarData = yield data_model_1.default.find({
                object: { $in: similarObjects.map(obj => obj._id) }
            });
            // Обчислення середніх значень по категоріях
            const tips = [];
            const categories = Object.values(data_types_1.ConsumptionCategory);
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
        });
    }
    getHistoricalComparison(userId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const past1Day = new Date(now);
            past1Day.setDate(past1Day.getDate() - 1);
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            const convertedObjectId = new mongoose_1.default.Types.ObjectId(objectId);
            const recentData = yield data_model_1.default.find({
                user: convertedUserId,
                object: convertedObjectId,
                date: { $gte: past1Day, $lte: now }
            });
            const historicalData = yield data_model_1.default.find({
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
        });
    }
    checkDailyLimit(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = yield object_model_1.default.findById(objectId);
            if (!object || !object.limit)
                return;
            console.log(object);
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const data = yield data_model_1.default.find({
                object: new mongoose_1.default.Types.ObjectId(objectId),
                date: { $gte: startOfDay, $lte: endOfDay }
            });
            const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);
            if (totalAmount > object.limit) {
                const tips = yield this.getOptimizationTips(object.owner._id.toString(), objectId);
                yield notification_service_1.default.createLimitExceededNotification(object.owner.toString(), objectId, totalAmount, object.limit, tips);
            }
        });
    }
}
const analyticService = new AnalyticsService();
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const data_types_1 = require("../data/data-types");
const notification_service_1 = __importDefault(require("../notifications/notification-service"));
const object_model_1 = __importDefault(require("../object/object-model"));
const user_service_1 = __importDefault(require("../user/user-service"));
(0, bind_all_1.default)(analyticService);
exports.default = analyticService;
//# sourceMappingURL=analytics-service.js.map