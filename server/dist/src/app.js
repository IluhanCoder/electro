"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const error_handler_1 = require("./error-handler");
const auth_router_1 = __importDefault(require("./auth/auth-router"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const auth_controller_1 = __importDefault(require("./auth/auth-controller"));
const user_router_1 = __importDefault(require("./user/user-router"));
const object_router_1 = __importDefault(require("./object/object-router"));
const data_router_1 = __importDefault(require("./data/data-router"));
const analytics_router_1 = __importDefault(require("./analytics/analytics-router"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const port = process.env.PORT;
const DB_URL = `mongodb+srv://komunx324:Aill1525@cluster0.fvj9j5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose_1.default.connect(DB_URL);
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL,
}));
app.use(express_1.default.json());
app.use("/auth", auth_router_1.default);
app.use(auth_controller_1.default.authMiddleware);
app.use("/user", user_router_1.default);
app.use("/object", object_router_1.default);
app.use("/data", data_router_1.default);
app.use("/analytics", analytics_router_1.default);
app.get("/test", (req, res) => { res.status(400).json({ message: "error" }); });
app.use(error_handler_1.errorHandler);
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map