import express from 'express';
import mongoose from 'mongoose';
import { errorHandler } from './error-handler';
import authRouter from './auth/auth-router';
import {config} from "dotenv";
import cors from "cors";
import authController from './auth/auth-controller';
import userRouter from './user/user-router';
import objectRouter from './object/object-router';
import dataRouter from './data/data-router';
import analyticsRouter from './analytics/analytics-router';
import notificationRouter from './notifications/notification-router';
import { sendUserEmail } from './email/email-controller';

config();

const app = express();

const port = process.env.PORT;
const DB_URL: string = `mongodb+srv://komunx324:Aill1525@cluster0.fvj9j5h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(DB_URL);

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

app.use("/auth", authRouter);

app.use(authController.authMiddleware);

app.use("/user", userRouter);
app.use("/object", objectRouter);
app.use("/data", dataRouter);
app.use("/analytics", analyticsRouter);
app.use("/notification", notificationRouter);


app.get("/test", (req, res) => {res.status(400).json({message: "error"})});

app.use(errorHandler);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});