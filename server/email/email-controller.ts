import { Request, Response, NextFunction } from "express";
import { sendEmail } from "./email-service";

export async function sendUserEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({ message: "Недостатньо даних для email" });
    }

    await sendEmail(to, subject, html);

    res.status(200).json({ message: "Email надіслано успішно" });
  } catch (error) {
    next(error);
  }
}
