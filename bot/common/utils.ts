import dayjs from "dayjs";
import { DATE_FORMAT } from "./constants";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { OptionsType, TSessionData } from "./types";
import { ExtraService, Program } from "../../backend/models/ExtraService";
import i18next from "i18next";
dayjs.extend(customParseFormat);

export const isValidDate = (dateString: string) => {
  const parsedDate = parseDate(dateString);
  return parsedDate.isValid() && parsedDate.isAfter(dayjs());
};

export const parseDate = (dateString: string) => {
  const parsedDate = dayjs(dateString, DATE_FORMAT, true);
  return parsedDate;
};

export const formatDate = (date: Date) => {
  const formatDate = dayjs(date).format(DATE_FORMAT);
  return formatDate;
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
  session.roomBookingStage = "";
  session.availableRoomId = "";
  session.checkInDate = "";
  session.checkOutDate = "";
  session.firstName = "";
  session.lastName = "";
  session.phone = "";
  session.roomIndex = 0;
  session.roomType = "";
  session.option = "";
  session.programName = "";
  session.serviceName = "";
  session.serviceBookingStage = "";
};

export const getProgramOptions = async (programName: string) => {
  const services = await ExtraService.findAll();
  const programOptions =
    services.flatMap((service) =>
      service.programs
        .filter((program) => program.programName === programName)
        .map((program) => program.options),
    )[0] || [];

  if (programOptions) {
    return programOptions;
  }

  return null;
};

export const findOptionByName = async (optionName: string) => {
  const services = await ExtraService.findAll();

  for (const service of services) {
    for (const program of service.programs) {
      const option = program.options.find(
        (option) => option.name === optionName,
      );

      if (option) {
        return option;
      }
    }
  }

  return null;
};

export const getSpaOptionDetails = async (
  programName: string,
  optionName: string,
) => {
  const programOptions = await getProgramOptions(programName);
  const option = programOptions?.find((option) => option.name === optionName);
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

export const addThreeDaysToDate = (date: string) => {
  const parsedDate = parseDate(date);
  return dayjs(parsedDate).add(3, "day");
};

export const addDaysToStartDate = (date: string, addingDays: number) => {
  const parsedDate = parseDate(date);
  return dayjs(parsedDate).add(addingDays, "day");
};

// Sort the `updatedPrograms` array based on the order defined in the original `programs` array.
export const sortPrograms = (
  updatedPrograms: Program[],
  programOrderMap: Map<string, number>,
) =>
  updatedPrograms.sort((a: Program, b: Program) => {
    const indexA = programOrderMap.get(a.id) ?? -1;
    const indexB = programOrderMap.get(b.id) ?? -1;
    return indexA - indexB;
  });

export const isSpaService = (serviceName: string) =>
  serviceName === i18next.t("extraServices.spa");

export const isLaundryService = (serviceName: string) =>
  serviceName === i18next.t("extraServices.laundry");
