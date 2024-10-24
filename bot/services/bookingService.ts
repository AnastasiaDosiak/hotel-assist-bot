import dayjs from "dayjs";
import { Room } from "../../backend/models/Room";
import {
  Option,
  Program,
  ExtraService,
} from "../../backend/models/ExtraService";
import { TSessionData, TUserBookingData } from "../common/types";
import { DATE_FORMAT, isOneDayProgram } from "../common/constants";
import i18next from "i18next";
import {
  addThreeDaysToDate,
  getSpaOptionDetails,
  sortPrograms,
} from "../common/utils";

export const bookRoom = async (roomId: string, userData: TUserBookingData) => {
  const roomToUpdate = await Room.findOne({
    where: { id: roomId },
  });

  if (roomToUpdate) {
    await roomToUpdate?.update({ bookedBy: [userData] });
  } else {
    throw new Error(i18next.t("bookingProcess.roomNotFound", { roomId }));
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
    return i18next.t("bookingProcess.roomUnavailable", {
      roomType,
      nextAvailableDate,
    });
  }

  return null; // no future availability information
};

export const checkOptionAvailability = async (
  serviceName: string,
  optionName: string,
  checkInDate: string,
  checkOutDate: string,
): Promise<Option | string | null> => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT).toDate();
  const checkOut = dayjs(checkOutDate, DATE_FORMAT).toDate();

  const service = await ExtraService.findOne({
    where: { serviceName },
  });

  const programs = service?.getDataValue("programs");

  const option =
    programs
      .flatMap((program: Program) => program.options)
      .find((option: Option) => {
        return option.name === optionName;
      }) || null;

  let earliestAvailableDate: Date | null = null;

  const isAvailable = option.bookedBy.every((booking: TUserBookingData) => {
    const bookedCheckIn = dayjs(booking.startDate, DATE_FORMAT).toDate();
    const bookedCheckOut = dayjs(booking.endDate, DATE_FORMAT).toDate();
    console.log(bookedCheckIn, "bookedCheckIn");
    const isConflict =
      (checkIn < bookedCheckOut && checkOut > bookedCheckIn) || // Overlap in booking
      checkIn.getTime() === bookedCheckIn.getTime(); // Exact start date conflict
    console.log(isConflict, "isConflict");

    if (isConflict) {
      if (!earliestAvailableDate || bookedCheckOut > earliestAvailableDate) {
        earliestAvailableDate = bookedCheckOut;
      }
    }
    console.log(isConflict, "isConflict");
    return !isConflict;
  });

  if (isAvailable) {
    return option;
  }
  if (earliestAvailableDate) {
    const nextAvailableDate = dayjs(earliestAvailableDate).format(DATE_FORMAT);
    return i18next.t("extraServices.optionNotFound", {
      optionName,
      nextAvailableDate,
    });
  }

  return null;
};

export const checkSpaOptionAvailability = async (
  serviceName: string,
  checkInDate: string,
  programName: string,
  optionName: string,
): Promise<Option | string | null> => {
  const checkIn = dayjs(checkInDate, DATE_FORMAT).toDate();
  const checkOut = isOneDayProgram(programName)
    ? checkIn
    : addThreeDaysToDate(checkInDate).toDate();
  const optionDetails = await getSpaOptionDetails(programName, optionName);
  let earliestAvailableDate: Date | null = null;

  const isAvailable = optionDetails?.bookedBy.every(
    (booking: TUserBookingData) => {
      const bookedCheckIn = dayjs(booking.startDate, DATE_FORMAT).toDate();
      // + 1 day if OneDayProgram
      const bookedCheckOut = isOneDayProgram(programName)
        ? dayjs(booking.endDate, DATE_FORMAT).add(1, "day").toDate()
        : dayjs(booking.endDate, DATE_FORMAT).toDate();
      // Check if the service is available in the desired period
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
    },
  );

  if (isAvailable && optionDetails) {
    return optionDetails;
  }

  // If no room is available, return a message with the earliest available date
  if (earliestAvailableDate) {
    const nextAvailableDate = dayjs(earliestAvailableDate).format(DATE_FORMAT);
    return i18next.t("extraServices.serviceUnavailable", {
      optionName,
      serviceName,
      nextAvailableDate,
    });
  }

  return null; // no future availability information
};

export const gatherBookingData = (chatId: number, session: TSessionData) => {
  return {
    userId: chatId.toString(),
    phone: session.phone,
    firstName: session.firstName,
    lastName: session.lastName,
    startDate: session.checkInDate,
    endDate: session.checkOutDate,
  };
};

export const bookSpaProgramOption = async (
  serviceName: string,
  programName: string,
  optionName: string,
  userData: TUserBookingData,
) => {
  const serviceToUpdate = await ExtraService.findOne({
    where: { serviceName },
  });

  if (serviceToUpdate) {
    // Extract the current programs and options
    const programs = serviceToUpdate.getDataValue("programs");

    // Find the specific program
    const programToUpdate = programs.find(
      (program: any) => program.programName === programName,
    );

    if (programToUpdate) {
      // Find the specific option within the program
      const optionToUpdate = programToUpdate.options.find(
        (option: any) => option.name === optionName,
      );

      if (optionToUpdate) {
        // Update the 'bookedBy' array for the option by appending the new userData
        optionToUpdate.bookedBy.push(userData);
        const filteredPrograms = programs.filter(
          (program: Program) =>
            program.programName !== programToUpdate.programName,
        );

        const updatedPrograms = [...filteredPrograms, programToUpdate];
        const programOrderMap = new Map(
          programs.map((program: Program, index: number) => [
            program.id,
            index,
          ]),
        ) as Map<string, number>;
        const sortedPrograms = sortPrograms(updatedPrograms, programOrderMap);
        // Save the updated service with the modified option
        await serviceToUpdate.update({
          programs: sortedPrograms,
        });

        return `Successfully booked option ${optionName} for user ${userData.firstName}`;
      } else {
        throw new Error(
          i18next.t("extraServices.optionNotFound", { optionName }),
        );
      }
    } else {
      throw new Error(
        i18next.t("extraServices.programNotFound", { programName }),
      );
    }
  } else {
    throw new Error(
      i18next.t("extraServices.serviceNotFound", { serviceName }),
    );
  }
};

export const bookProgramOption = async (
  serviceName: string,
  programName: string,
  optionName: string,
  userData: TUserBookingData,
) => {
  const serviceToUpdate = await ExtraService.findOne({
    where: { serviceName },
  });

  if (!serviceToUpdate) {
    throw new Error(
      i18next.t("extraServices.serviceNotFound", { serviceName }),
    );
  }

  // Extract the current programs and options
  const programs = serviceToUpdate.getDataValue("programs");

  // Find the specific program containing the option
  const programToUpdate = programs.find((program: Program) =>
    program.options.some((option: Option) => option.name === optionName),
  );

  if (!programToUpdate) {
    throw new Error(
      i18next.t("extraServices.programNotFound", { programName }),
    );
  }

  // Find the specific option within the program
  const optionToUpdate = programToUpdate.options.find(
    (option: Option) => option.name === optionName,
  );

  if (!optionToUpdate) {
    throw new Error(i18next.t("extraServices.optionNotFound", { optionName }));
  }

  // Update the 'bookedBy' array for the option by appending the new userData
  optionToUpdate.bookedBy.push(userData);

  // Create a new program object that reflects the update
  const updatedProgram = {
    ...programToUpdate,
    options: programToUpdate.options.map((option: Option) =>
      option.name === optionName ? optionToUpdate : option,
    ), // Ensure options are updated in the same order
  };

  // Update the programs array with the updated program
  const updatedPrograms = programs.map((program: Program) =>
    program.programName === programName ? updatedProgram : program,
  );

  // Set the new programs array in the serviceToUpdate object
  serviceToUpdate.setDataValue("programs", updatedPrograms);

  // Mark the programs field as changed to ensure Sequelize updates it
  serviceToUpdate.changed("programs", true);

  // Save the updated service with the modified programs array
  await serviceToUpdate.save();

  return optionToUpdate;
};
