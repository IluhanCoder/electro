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
exports.getAllCountersForService = void 0;
const counter_model_1 = __importDefault(require("./counter-model"));
const getAllCountersForService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user; // якщо ти використовуєш auth middleware
        if (!user || user.role !== "service") {
            return res.status(403).json({ message: "Access denied" });
        }
        const counters = yield counter_model_1.default.find()
            .populate({
            path: "user",
            select: "name email"
        })
            .populate({
            path: "object",
            select: "name type"
        });
        res.json(counters);
    }
    catch (err) {
        console.error("Failed to fetch counters:", err);
        res.status(500).json({ message: "Failed to load counters" });
    }
});
exports.getAllCountersForService = getAllCountersForService;
//# sourceMappingURL=get-counters.js.map