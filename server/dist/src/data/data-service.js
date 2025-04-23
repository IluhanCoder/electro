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
const bind_all_1 = __importDefault(require("../helpers/bind-all"));
const data_model_1 = __importDefault(require("./data-model"));
const data_types_1 = require("./data-types");
const faker_1 = require("@faker-js/faker");
const object_model_1 = __importDefault(require("../object/object-model"));
const analytics_service_1 = __importDefault(require("../analytics/analytics-service"));
class DataService {
    createData(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_model_1.default.create(credentials);
            yield analytics_service_1.default.checkAndNotifyAnomalies(credentials.object);
        });
    }
    fetchUserData(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedUserId = new mongoose_1.default.Types.ObjectId(userId);
            const data = yield data_model_1.default
                .find({ user: convertedUserId }).sort({ date: -1 })
                .populate("object", "name type createdAt updatedAt");
            return data;
        });
    }
    fetchDataForAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield data_model_1.default
                .find().sort({ date: -1 })
                .populate("object", "name createdAt updatedAt")
                .populate("user", "name surname nickname email"));
            return data;
        });
    }
    getDataByDateRange(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield data_model_1.default.find({
                user: userId,
                date: {
                    $gte: startDate,
                    $lte: endDate
                }
            }).sort({ date: -1 }).populate("object", "name type createdAt updatedAt"));
        });
    }
    getObjectData(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedObjectId = new mongoose_1.default.Types.ObjectId(objectId);
            return (yield data_model_1.default.find({
                object: convertedObjectId
            }).sort({ date: -1 }).populate("object", "name type createdAt updatedAt"));
        });
    }
    deleteDataById(dataId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield data_model_1.default.findByIdAndDelete(dataId);
        });
    }
    generateDataForUser(userId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const INTERVAL_MS = 20 * 1000;
            const MINUTES_BACK = 60;
            const MAX_ENTRIES_PER_CATEGORY = 100;
            const START_DATE = new Date(Date.now() - MINUTES_BACK * 60 * 1000);
            const END_DATE = new Date();
            const object = yield object_model_1.default.findById(objectId);
            if (!object) {
                throw new Error("Object not found.");
            }
            const categories = Object.values(data_types_1.ConsumptionCategory);
            const dataToInsert = [];
            for (const category of categories) {
                let current = new Date(START_DATE);
                let entriesCount = 0;
                while (current <= END_DATE && entriesCount < MAX_ENTRIES_PER_CATEGORY) {
                    const randomAmount = +(Math.random() * 10).toFixed(2);
                    const data = new data_model_1.default({
                        object: objectId,
                        user: userId,
                        amount: randomAmount,
                        category,
                        comment: faker_1.faker.lorem.words(3),
                        date: new Date(current)
                    });
                    dataToInsert.push(data);
                    current = new Date(current.getTime() + INTERVAL_MS);
                    entriesCount++;
                }
            }
            console.log(`Generated ${dataToInsert.length} records for object ${objectId}`);
            yield data_model_1.default.insertMany(dataToInsert);
        });
    }
    generateInstantDataForUser(userId, objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const object = yield object_model_1.default.findById(objectId);
            if (!object) {
                throw new Error("Object not found.");
            }
            const categories = Object.values(data_types_1.ConsumptionCategory);
            const now = new Date();
            const dataToInsert = categories.map(category => {
                return new data_model_1.default({
                    object: objectId,
                    user: userId,
                    amount: +(Math.random() * 10).toFixed(2),
                    category,
                    comment: faker_1.faker.lorem.words(3),
                    date: now
                });
            });
            console.log(`Generated ${dataToInsert.length} instant records for object ${objectId}`);
            yield data_model_1.default.insertMany(dataToInsert);
            yield analytics_service_1.default.checkAndNotifyAnomalies(objectId);
        });
    }
}
const dataService = new DataService();
(0, bind_all_1.default)(dataService);
exports.default = dataService;
//# sourceMappingURL=data-service.js.map