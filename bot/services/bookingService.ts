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
  formatDate,
  getSpaOptionDetails,
  isDateValidAndAfterNow,
  sortPrograms,
} from "../common/utils";
import { BookedBy } from "../../backend/models/BookedBy";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

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

// availability section

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
    const isAvailable = room.bookedBy.every((booking: BookedBy) => {
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

  const isAvailable = option.bookedBy.every((booking: BookedBy) => {
    const bookedCheckIn = dayjs(booking.startDate, DATE_FORMAT).toDate();
    const bookedCheckOut = dayjs(booking.endDate, DATE_FORMAT).toDate();
    const isConflict =
      (checkIn < bookedCheckOut && checkOut > bookedCheckIn) || // Overlap in booking
      checkIn.getTime() === bookedCheckIn.getTime(); // Exact start date conflict

    if (isConflict) {
      if (!earliestAvailableDate || bookedCheckOut > earliestAvailableDate) {
        earliestAvailableDate = bookedCheckOut;
      }
    }
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

  const isAvailable = optionDetails?.bookedBy.every((booking: BookedBy) => {
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
  });

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

export const checkProvidedUserDataInRoom = async (
  roomNumber: number,
  phone: string,
  startDate: string,
) => {
  const foundRoom = await Room.findOne({
    where: { roomNumber },
  });

  if (foundRoom) {
    const isProvidedPhoneCorrect = foundRoom.bookedBy.every(
      (booking: BookedBy) => {
        if (booking.phone === phone && booking.startDate === startDate) {
          // check if the checkout date is not in the past
          if (isDateValidAndAfterNow(booking.endDate as string)) {
            return booking;
          }
        }
      },
    );
    if (isProvidedPhoneCorrect) {
      return isProvidedPhoneCorrect;
    }
    return i18next.t("extraServices.roomPhoneNumberInvalid");
  } else {
    return i18next.t("extraServices.roomNumberInvalid");
  }
};
export const gatherBookingData = (chatId: number, session: TSessionData) => {
  return {
    userId: chatId.toString(),
    phone: session.phone,
    firstName: session.firstName,
    lastName: session.lastName,
    startDate: session.checkInDate,
    endDate: session.checkOutDate || null,
    startTime: session.restaurantBookedTime || null,
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

export const bookLaundryOption = async (
  serviceName: string,
  laundryOption: string,
  bookedRoomNumber: number,
  providedStartDate: string,
  providedPhone: string,
) => {
  const foundBookedRoom = await Room.findOne({
    where: { roomNumber: bookedRoomNumber },
  });
  if (foundBookedRoom) {
    const serviceToUpdate = await ExtraService.findOne({
      where: { serviceName },
    });
    if (serviceToUpdate) {
      const bookedByRoom = foundBookedRoom.bookedBy.find(
        (booking: BookedBy) => {
          if (
            booking.phone === providedPhone &&
            booking.startDate === providedStartDate
          ) {
            return booking;
          }
        },
      );
      if (bookedByRoom) {
        // Extract the current programs and options
        const programs = serviceToUpdate.getDataValue("programs");

        // Find the specific program containing the option
        const programToUpdate = programs.find((program: Program) =>
          program.options.some(
            (option: Option) => option.name === laundryOption,
          ),
        );

        if (!programToUpdate) {
          throw new Error(
            i18next.t("extraServices.programNotFound", { laundryOption }),
          );
        }
        const optionToUpdate = programToUpdate.options.find(
          (option: Option) => option.name === laundryOption,
        );

        optionToUpdate.bookedBy.push(bookedByRoom);

        const updatedProgram = {
          ...programToUpdate,
          options: programToUpdate.options.map((option: Option) =>
            option.name === laundryOption ? optionToUpdate : option,
          ), // Ensure options are updated in the same order
        };

        // Set the new programs array in the serviceToUpdate object
        serviceToUpdate.setDataValue("programs", [updatedProgram]);

        // Mark the programs field as changed to ensure Sequelize updates it
        serviceToUpdate.changed("programs", true);

        // Save the updated service with the modified programs array
        await serviceToUpdate.save();

        return optionToUpdate;
      } else {
        throw new Error(
          i18next.t("extraServices.bookedByInfoNotFound", { serviceName }),
        );
      }
    } else {
      throw new Error(
        i18next.t("extraServices.serviceNotFound", { serviceName }),
      );
    }
  } else {
    throw new Error(i18next.t("extraServices.notFoundRoom"));
  }
};

export const bookRestaurantTable = async (
  serviceName: string,
  restaurantOption: string,
  bookedBy: TUserBookingData,
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
  const programToUpdate = findProgramWithOption(
    serviceToUpdate,
    restaurantOption,
  );

  if (!programToUpdate) {
    return i18next.t("extraServices.programNotFound", { restaurantOption });
  }

  const optionToUpdate = programToUpdate.options.find(
    (option: Option) => option.name === restaurantOption,
  );

  optionToUpdate.bookedBy.push(bookedBy);

  const updatedProgram = {
    ...programToUpdate,
    options: programToUpdate.options.map((option: Option) =>
      option.name === restaurantOption ? optionToUpdate : option,
    ), // Ensure options are updated in the same order
  };

  // Set the new programs array in the serviceToUpdate object
  serviceToUpdate.setDataValue("programs", [updatedProgram]);

  // Mark the programs field as changed to ensure Sequelize updates it
  serviceToUpdate.changed("programs", true);

  // Save the updated service with the modified programs array
  await serviceToUpdate.save();

  return i18next.t("extraServices.restaurantBooked", {
    restaurant: restaurantOption,
    date: bookedBy.startDate,
    time: bookedBy.startTime,
  });
};

export const bookExtraCleaningOption = async (
  serviceName: string,
  laundryOption: string,
  bookedRoomNumber: number,
  providedPhone: string,
  providedCheckInDate: string,
) => {
  const now = new Date();
  const formattedTodayDate = formatDate(now); // Today's date in 'DD/MM/YYYY'
  const requestedCleaningTime = now.toTimeString().slice(0, 5); // Current time in 'HH:mm'
  const tomorrow = dayjs(now).add(1, "day").format(DATE_FORMAT); // Move to the next day

  const foundBookedRoom = await Room.findOne({
    where: { roomNumber: bookedRoomNumber },
  });

  if (!foundBookedRoom) {
    throw new Error(i18next.t("extraServices.notFoundRoom"));
  }

  const serviceToUpdate = await ExtraService.findOne({
    where: { serviceName },
  });
  if (!serviceToUpdate) {
    throw new Error(
      i18next.t("extraServices.serviceNotFound", { serviceName }),
    );
  }

  const currentBooking = foundBookedRoom.bookedBy.find(
    (booking: BookedBy) =>
      booking.phone === providedPhone &&
      booking.startDate === providedCheckInDate,
  );

  if (!currentBooking) {
    return i18next.t("extraServices.bookedByInfoNotFound", { serviceName });
  }

  // Extract the current programs and options
  const programToUpdate = findProgramWithOption(serviceToUpdate, laundryOption);

  if (!programToUpdate) {
    return i18next.t("extraServices.programNotFound", { laundryOption });
  }

  const optionToUpdate = programToUpdate.options.find(
    (option: Option) => option.name === laundryOption,
  );

  const startServiceTime = optionToUpdate?.startWorkingTime;
  const endServiceTime = optionToUpdate?.endWorkingTime;

  // Check if the room limit has been reached for today
  if (isRoomLimitReached(optionToUpdate, formattedTodayDate)) {
    return i18next.t("extraCleaningSection.maxRoomsReached");
  }

  // Handle late request if outside working hours
  if (
    isOutsideWorkingHours(
      requestedCleaningTime,
      startServiceTime,
      endServiceTime,
    )
  ) {
    if (isLateRequest(currentBooking, formattedTodayDate, tomorrow)) {
      return i18next.t("extraCleaningSection.lateRequest");
    }

    if (isScheduledForTomorrow(currentBooking, tomorrow)) {
      await scheduleCleaningForNextDay(
        currentBooking,
        tomorrow,
        serviceToUpdate,
        programToUpdate,
        optionToUpdate,
      );
      return i18next.t("extraCleaningSection.scheduledForNextDay", {
        nextDayFormatted: tomorrow,
        startServiceTime,
        endServiceTime,
      });
    }
  }

  // Handle scheduled cleaning for today
  await scheduleCleaningForToday(
    currentBooking,
    serviceToUpdate,
    programToUpdate,
    optionToUpdate,
  );
  return i18next.t("extraCleaningSection.informMessage", {
    startServiceTime,
    endServiceTime,
  });
};

// Helper Functions

const findProgramWithOption = (service: ExtraService, optionName: string) => {
  return service
    .getDataValue("programs")
    .find((program: Program) =>
      program.options.some((option: Option) => option.name === optionName),
    );
};

const isRoomLimitReached = (option: Option, today: string) => {
  return (
    option.bookedBy.filter((booking: BookedBy) => booking.startDate === today)
      .length >= 5
  );
};

const isOutsideWorkingHours = (
  requestedTime: string,
  startTime?: string,
  endTime?: string,
) => {
  return (
    requestedTime < (startTime as string) || requestedTime > (endTime as string)
  );
};

const isLateRequest = (booking: BookedBy, today: string, tomorrow: string) => {
  const bookingEndDate = dayjs(booking.endDate, DATE_FORMAT);
  const todayDate = dayjs(today, DATE_FORMAT);
  const tomorrowDate = dayjs(tomorrow, DATE_FORMAT);

  return (
    bookingEndDate.isSame(todayDate) || bookingEndDate.isSame(tomorrowDate)
  );
};

const isScheduledForTomorrow = (booking: BookedBy, tomorrow: string) => {
  const tomorrowDate = dayjs(tomorrow, DATE_FORMAT);
  return dayjs(booking.endDate, DATE_FORMAT).isAfter(tomorrowDate);
};

const scheduleCleaningForNextDay = async (
  booking: BookedBy,
  tomorrow: string,
  service: ExtraService,
  program: Program,
  option: Option,
) => {
  booking.startDate = tomorrow;
  option.bookedBy.push(booking);
  updateServiceProgram(service, program, option);
  await service.save();
};

const scheduleCleaningForToday = async (
  booking: BookedBy,
  service: ExtraService,
  program: Program,
  option: Option,
) => {
  option.bookedBy.push(booking);
  updateServiceProgram(service, program, option);
  await service.save();
};

const updateServiceProgram = (
  service: ExtraService,
  program: Program,
  option: Option,
) => {
  const updatedProgram = {
    ...program,
    options: program.options.map((opt: Option) =>
      opt.name === option.name ? option : opt,
    ),
  };
  service.setDataValue("programs", [updatedProgram]);
  service.changed("programs", true);
};

export const checkRestaurantAvailability = async (
  serviceName: string,
  optionName: string,
  bookedDate: string,
  bookedStartTime: string, // format 14:00 f.e.
): Promise<Option | string | null> => {
  const bookedTime = dayjs(
    `${bookedDate} ${bookedStartTime}`,
    `${DATE_FORMAT} HH:mm`,
  );
  const bookedEndTime = bookedTime.add(2, "hour"); // Default booking is 2 hours

  const service = await ExtraService.findOne({ where: { serviceName } });

  if (!service) {
    return i18next.t("extraServices.serviceNotFound", { serviceName });
  }

  const programs = service.getDataValue("programs");
  const option =
    programs
      .flatMap((program: Program) => program.options)
      .find((option: Option) => option.name === optionName) || null;

  if (!option) {
    return i18next.t("extraServices.optionNotFound", { optionName });
  }

  const startWorkingTime = dayjs(
    `${bookedDate} ${option.startWorkingTime}`,
    `${DATE_FORMAT} HH:mm`,
  );
  const endWorkingTime = dayjs(
    `${bookedDate} ${option.endWorkingTime}`,
    `${DATE_FORMAT} HH:mm`,
  );

  // Check if booking is outside working hours
  if (
    bookedTime.isBefore(startWorkingTime) ||
    bookedEndTime.isAfter(endWorkingTime)
  ) {
    if (bookedEndTime.isAfter(endWorkingTime)) {
      return i18next.t("extraServices.overlapWithNotWorkingHours");
    }
    return i18next.t("extraServices.tooLate");
  }

  // Check if booking is near the closing time
  if (
    bookedTime.isAfter(endWorkingTime.subtract(2, "hour")) &&
    bookedTime.isBefore(endWorkingTime)
  ) {
    return i18next.t("extraServices.partialAvailability", {
      bookedStartTime,
      closingTime: option.endWorkingTime,
    });
  }

  // Conflict check: Ensure there's no conflict with existing bookings
  let overlappingBookings = 0; // Track overlapping bookings

  option.bookedBy.every((booking: BookedBy) => {
    const bookingStartTime = dayjs(
      `${booking.startDate} ${booking.startTime}`,
      `${DATE_FORMAT} HH:mm`,
    );
    const bookingEndTime = bookingStartTime.add(2, "hour");

    const isConflict =
      bookedTime.isBetween(bookingStartTime, bookingEndTime, null, "[)") ||
      bookedEndTime.isBetween(bookingStartTime, bookingEndTime, null, "[)") ||
      bookingStartTime.isBetween(bookedTime, bookedEndTime, null, "[)");

    // If conflict, increment overlapping bookings
    if (isConflict) {
      overlappingBookings += 1;
    }

    return overlappingBookings < option.availableTables;
  });

  // Check if there are enough tables available
  if (overlappingBookings >= option.availableTables) {
    return i18next.t("extraServices.noAvailableTables", { bookedStartTime });
  }

  // If everything is fine, return the option
  return option;
};
