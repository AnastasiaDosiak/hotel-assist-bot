import dayjs from "dayjs";
import { DATE_FORMAT } from "./constants";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { OptionsType, TSessionData } from "./types";
import { ExtraService } from "../../backend/models/ExtraService";

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

export const getProgramOptions = async (programName: string) => {
  const services = await ExtraService.findAll();
  const programOptions =
    services.flatMap((service) =>
      service.programs
        .filter((program) => program.programName === programName)
        .map((program) => program.options),
    )[0] || [];

  return programOptions;
};

export const getOptionDetails = async (
  programName: string,
  optionName: string,
) => {
  const programOptions = await getProgramOptions(programName);
  const option = programOptions.find((option) => option.name === optionName);
  return option;
};

export const createKeyboardOptions = <T extends Record<string, any>>(
  options: OptionsType<T>,
  callbackData: string,
  parameter: keyof T,
) => {
  const mappedOptions = options.map((option) => option[parameter]);
  const keyboardOptions = mappedOptions.map((option) => [
    {
      text: option,
      callback_data: `${callbackData}${option}`,
    },
  ]);

  return keyboardOptions;
};
