import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { sequelize } from "./db";
import { Room } from "./models/room";
import { roomTypes } from "./common/constants";

const app = express();
const PORT = process.env.PORT || 3000;

const generateFakeRooms = async (numRooms: number) => {
  for (let i = 0; i < numRooms; i++) {
    const roomType = faker.helpers.arrayElement(roomTypes);

    await Room.create({
      id: faker.string.uuid(),
      type: roomType.type,
      available: faker.datatype.boolean(),
      price: roomType.price,
      currency: "UAH",
      imageUrl: roomType.imageUrl,
      roomNumber: faker.number.int({ min: 1, max: 50 }),
      bookedDates: [],
      minGuests: roomType.minGuests,
      maxGuests: roomType.maxGuests,
      bookedBy: [],
      extraServices: [],
    });
  }
};

app.get("/rooms", async (req: Request, res: Response) => {
  const rooms = await Room.findAll();
  res.json(rooms);
});

sequelize.sync({ force: true }).then(async () => {
  await generateFakeRooms(50);

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
