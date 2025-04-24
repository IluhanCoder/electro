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
const object_model_1 = __importDefault(require("./object-model"));
const object_error_1 = __importDefault(require("./object-error"));
const data_service_1 = __importDefault(require("../data/data-service"));
const user_service_1 = __importDefault(require("../user/user-service"));
exports.default = new class ObjectService {
    createObject(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedOwnerId = new mongoose_1.default.Types.ObjectId(credentials.owner);
            const candidate = yield object_model_1.default.find({ owner: convertedOwnerId, name: credentials.name });
            if (candidate.length === 0)
                yield object_model_1.default.create(credentials);
            else
                throw object_error_1.default.ObjectExists();
        });
    }
    getUserObjects(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const convertedOwnerId = new mongoose_1.default.Types.ObjectId(userId);
            const isAdmin = yield user_service_1.default.isAdmin(userId);
            return isAdmin ? yield object_model_1.default.find() : yield object_model_1.default.find({ owner: convertedOwnerId });
        });
    }
    deleteObjectById(objectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToDelete = yield data_service_1.default.getObjectData(objectId);
            dataToDelete.map((data) => __awaiter(this, void 0, void 0, function* () {
                yield data_service_1.default.deleteDataById(data._id.toString());
            }));
            yield object_model_1.default.findByIdAndDelete(objectId);
        });
    }
    setLimit(objectId, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            yield object_model_1.default.findByIdAndUpdate(objectId, { limit });
        });
    }
};
//# sourceMappingURL=object-service.js.map