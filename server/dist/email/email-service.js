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
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function sendEmail(to, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: (_a = process.env.EMAIL_USER) === null || _a === void 0 ? void 0 : _a.trim(),
                pass: (_b = process.env.EMAIL_PASS) === null || _b === void 0 ? void 0 : _b.trim(),
            },
        });
        console.log("EMAIL_USER:", process.env.EMAIL_USER);
        console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
        const mailOptions = {
            from: `"Energy Optimizer" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        };
        yield transporter.sendMail(mailOptions);
    });
}
//# sourceMappingURL=email-service.js.map