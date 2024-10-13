import dayjs from "dayjs";
import { DATE_FORMAT } from "./constants";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { Room } from "../../backend/models/room";

export const isValidDate = (dateString: string) => {
  dayjs.extend(customParseFormat);
  const parsedDate = dayjs(dateString, DATE_FORMAT, true);
  return parsedDate.isValid() && parsedDate.isAfter(dayjs());
};

// Function to calculate the difference in days using dayjs
export const getDifferenceInDays = (
  checkInDate: string,
  checkOutDate: string,
): number => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT);
  const checkOut = dayjs(checkOutDate, DATE_FORMAT);
  return checkOut.diff(checkIn, "day");
};

// Check if the checkout date is after the check-in date
export const isCheckoutDateValid = (
  checkInDate: string,
  checkoutDate: string,
) => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT, true);
  const checkOut = dayjs(checkoutDate, DATE_FORMAT, true);
  return checkOut.isAfter(checkIn);
};

// Function to check room availability based on the user's selected dates
export const checkRoomAvailability = async (
  roomType: string,
  checkInDate: string,
  checkOutDate: string,
) => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT).toDate();
  const checkOut = dayjs(checkOutDate, DATE_FORMAT).toDate();

  // Find all rooms of the selected type
  const rooms = await Room.findAll({
    where: { type: roomType },
  });

  for (const room of rooms) {
    const isAvailable = room.bookedBy.every(
      (booking: {
        userId: string;
        phone: string;
        firstName: string;
        lastName: string;
        startDate: string;
        endDate: string;
      }) => {
        const bookedCheckIn = new Date(booking.startDate);
        const bookedCheckOut = new Date(booking.endDate);
        return checkOut <= bookedCheckIn || checkIn >= bookedCheckOut;
      },
    );

    if (isAvailable) {
      return room; // Return the first available room
    }
  }

  return null; // No room available
};

// Function to book the room by adding the user details to bookedBy
export const bookRoom = async (
  room: Room,
  userData: {
    userId: string;
    phone: string;
    firstName: string;
    lastName: string;
    startDate: string;
    endDate: string;
  },
) => {
  room.bookedBy.push(userData);
  await room.save(); // Save the updated room in the database
};
