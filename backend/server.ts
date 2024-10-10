import express, { Request, Response } from "express";
import { faker } from "@faker-js/faker";
import { sequelize } from "./db"; // Import Sequelize connection
import { Room } from "./models/room"; // Import Room model

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Possible room types in the hotel
const roomTypes = ["Standard", "Deluxe", "Suite", "Presidential"];

// Define the image URLs for each room type using Unsplash
const roomImages: { [key: string]: string } = {
  Standard:
    "https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?q=80&w=3173&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  Deluxe:
    "https://plus.unsplash.com/premium_photo-1675616563084-63d1f129623d?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // URL for Deluxe room image
  Suite:
    "https://plus.unsplash.com/premium_photo-1661962495669-d72424626bdc?q=80&w=2971&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // URL for Suite room image
  Presidential:
    "https://plus.unsplash.com/premium_photo-1661884238187-1c274b3c3413?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // URL for Presidential room image
};

// Function to generate fake rooms
const generateFakeRooms = async (numRooms: number) => {
  for (let i = 0; i < numRooms; i++) {
    const type = faker.helpers.arrayElement(roomTypes);
    await Room.create({
      id: faker.string.uuid(),
      type: type,
      available: faker.datatype.boolean(),
      price: faker.number.int({ min: 5000, max: 10000 }),
      currency: "UAH",
      imageUrl: roomImages[type],
      roomNumber: faker.number.int({ min: 1, max: 50 }),
      bookedDates: [],
    });
  }
};

// API route to get all rooms from the database
app.get("/rooms", async (req: Request, res: Response) => {
  const rooms = await Room.findAll(); // Retrieve all rooms from the database
  res.json(rooms);
});

// Sync Sequelize models and start the server
sequelize.sync({ force: true }).then(async () => {
  await generateFakeRooms(40);

  // Start the server
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
});
