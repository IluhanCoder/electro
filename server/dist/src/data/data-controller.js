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
const data_service_1 = __importDefault(require("./data-service"));
const user_service_1 = __importDefault(require("../user/user-service"));
const user_error_1 = __importDefault(require("../user/user-error"));
class DataController {
    createData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const { credentials } = req.body;
                yield data_service_1.default.createData(Object.assign(Object.assign({}, credentials), { user: user._id }));
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchUserData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const data = yield data_service_1.default.fetchUserData(user._id.toString());
                return res.status(200).json({ data, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    fetchDataForAdmin(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const userIsAdmin = yield user_service_1.default.isAdmin(user._id.toString());
                if (userIsAdmin) {
                    const data = data_service_1.default.fetchDataForAdmin();
                    return res.status(200).json({ data, message: "success" });
                }
                throw user_error_1.default.WrongRole();
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDataByDateRange(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const { startDate, endDate } = req.body;
                const data = yield data_service_1.default.getDataByDateRange(user._id.toString(), startDate, endDate);
                return res.status(200).send({ data, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getObjectData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { objectId } = req.params;
                const data = yield data_service_1.default.getObjectData(objectId);
                return res.status(200).send({ data, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDataById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { dataId } = req.params;
                yield data_service_1.default.deleteDataById(dataId);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    generateDataforUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const { objectId } = req.params;
                yield data_service_1.default.generateDataForUser(user._id.toString(), objectId);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const dataController = new DataController();
(0, bind_all_1.default)(dataController);
exports.default = dataController;
//# sourceMappingURL=data-controller.js.map