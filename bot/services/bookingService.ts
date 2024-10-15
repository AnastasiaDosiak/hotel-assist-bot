import dayjs from "dayjs";
import { Room } from "../../backend/models/room";
import { TUserBookingData, TUserSession } from "../common/types";
import { DATE_FORMAT } from "../common/constants";

export const bookRoom = async (roomId: string, userData: TUserBookingData) => {
  const roomToUpdate = await Room.findOne({
    where: { id: roomId },
  });

  if (roomToUpdate) {
    await roomToUpdate?.update({ bookedBy: [userData] });
  } else {
    throw new Error(`No room found with such id: ${roomId}`);
  }
};

// Function to check room availability based on the user's selected dates
export const checkRoomAvailability = async (
  roomType: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<Room | string | null> => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT).toDate();
  const checkOut = dayjs(checkOutDate, DATE_FORMAT).toDate();

  // Find all rooms of the selected type
  const rooms = await Room.findAll({
    where: { type: roomType },
  });

  let earliestAvailableDate: Date | null = null;

  for (const room of rooms) {
    const isAvailable = room.bookedBy.every((booking: TUserBookingData) => {
      const bookedCheckIn = dayjs(booking.startDate, DATE_FORMAT).toDate();
      const bookedCheckOut = dayjs(booking.endDate, DATE_FORMAT).toDate();

      // Check if the room is available in the desired period
      const isConflict =
        (checkIn < bookedCheckOut && checkOut > bookedCheckIn) || // Overlap in booking
        checkIn.getTime() === bookedCheckIn.getTime(); // Exact start date conflict

      // If there is a conflict, calculate the earliest availability
      if (isConflict) {
        if (!earliestAvailableDate || bookedCheckOut > earliestAvailableDate) {
          earliestAvailableDate = bookedCheckOut;
        }
      }

      return !isConflict;
    });

    if (isAvailable) {
      return room; // Return the first available room
    }
  }

  // If no room is available, return a message with the earliest available date
  if (earliestAvailableDate) {
    const nextAvailableDate = dayjs(earliestAvailableDate).format(DATE_FORMAT);
    return `Room ${roomType} is unavailable in that dates. You can book ${roomType} room from ${nextAvailableDate} or look at other rooms.`;
  }

  return null; // no future availability information
};

export const gatherBookingData = (
  chatId: number,
  userSessions: TUserSession,
) => {
  return {
    userId: chatId.toString(),
    phone: userSessions[chatId].phone,
    firstName: userSessions[chatId].firstName,
    lastName: userSessions[chatId].lastName,
    startDate: userSessions[chatId].checkInDate,
    endDate: userSessions[chatId].checkOutDate,
  };
};
