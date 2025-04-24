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
const object_service_1 = __importDefault(require("./object-service"));
class ObjectController {
    createObject(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const { credentials } = req.body;
                yield object_service_1.default.createObject(Object.assign(Object.assign({}, credentials), { owner: user._id.toString() }));
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getUserObjects(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { user } = req;
                const objects = yield object_service_1.default.getUserObjects(user._id.toString());
                return res.status(200).json({ objects, message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteObjectById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { objectId } = req.params;
                yield object_service_1.default.deleteObjectById(objectId);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
    setLimit(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { objectId } = req.params;
                const { limit } = req.body;
                yield object_service_1.default.setLimit(objectId, limit);
                return res.status(200).json({ message: "success" });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
const objectController = new ObjectController();
(0, bind_all_1.default)(objectController);
exports.default = objectController;
//# sourceMappingURL=object-controller.js.map