import CounterModel from "./counter-model";
import UserModel from "../user/user-model";
import ObjectModel from "../object/object-model";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../auth/auth-types";

export const getAllCountersForService = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const user = req.user; // якщо ти використовуєш auth middleware

        if (!user || user.role !== "service") {
            return res.status(403).json({ message: "Access denied" });
        }

        const counters = await CounterModel.find()
            .populate({
                path: "user",
                select: "name email"
            })
            .populate({
                path: "object",
                select: "name type"
            });

        res.json(counters);
    } catch (err) {
        console.error("Failed to fetch counters:", err);
        res.status(500).json({ message: "Failed to load counters" });
    }
};
