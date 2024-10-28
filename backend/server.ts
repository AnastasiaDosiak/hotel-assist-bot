import express, { Request, Response } from "express";
import { sequelize } from "./db";
import { Room } from "./models/Room";
import {
  generateExtraServices,
  generateFAQ,
  generateFeedbacks,
  generateRooms,
} from "./servicesData";
import { initI18n } from "../i18n";
import { ExtraService } from "./models/ExtraService";
import { Feedback } from "./models/Feedback";

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize i18n (localization)
initI18n();

app.get("/rooms", async (req: Request, res: Response) => {
  const rooms = await Room.findAll();
  res.json(rooms);
});

app.get("/services", async (req: Request, res: Response) => {
  const services = await ExtraService.findAll();
  res.json(services);
});

app.get("/feedbacks", async (req: Request, res: Response) => {
  const feedbacks = await Feedback.findAll();
  res.json(feedbacks);
});

sequelize.sync({ force: true }).then(async () => {
  await generateRooms(50);
  await generateExtraServices();
  await generateFAQ();
  await generateFeedbacks(10);

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
