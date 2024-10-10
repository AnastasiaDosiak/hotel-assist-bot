import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Mock data for rooms
const rooms = [
  { id: 1, type: 'Standard', available: true },
  { id: 2, type: 'Deluxe', available: false },
  { id: 3, type: 'Suite', available: true },
];

// Route to get rooms
app.get('/rooms', (req: Request, res: Response) => {
  res.json(rooms);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
