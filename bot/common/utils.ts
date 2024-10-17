import dayjs from "dayjs";
import { DATE_FORMAT } from "./constants";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { TSessionData } from "./types";

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

export const resetSession = (session: TSessionData) => {
  session.bookingstage = "";
  session.availableRoomId = "";
  session.checkInDate = "";
  session.checkOutDate = "";
  session.firstName = "";
  session.lastName = "";
  session.phone = "";
  session.roomIndex = 0;
  session.roomType = "";
};
