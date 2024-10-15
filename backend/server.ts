import express, { Request, Response } from "express";
import { sequelize } from "./db";
import { Room } from "./models/room";
import { generateExtraServices, generateRooms } from "./servicesData";
import { initI18n } from "../i18n";

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize i18n (localization)
initI18n();

app.get("/rooms", async (req: Request, res: Response) => {
  const rooms = await Room.findAll();
  res.json(rooms);
});

sequelize.sync({ force: true }).then(async () => {
  await generateRooms(50);
  await generateExtraServices();

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
