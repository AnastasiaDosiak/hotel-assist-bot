import { isOneDayProgram } from "./../common/constants";
import i18next from "i18next";
import { CallbackHandler, TSessionData } from "../common/types";
import {
  addDaysToStartDate,
  addThreeDaysToDate,
  formatDate,
  isExtraCleaningService,
  isLaundryService,
  isRestaurantBooking,
  isSpaService,
} from "../common/utils";

// Handler for room booking
export const handleBookRoom: CallbackHandler = async ({
  bot,
  chatId,
  userSessions,
  message,
  currentRoomIndex,
}) => {
  if (userSessions && message) {
    userSessions[chatId] = {
      ...userSessions[chatId],
      roomBookingStage: "awaiting_checkin_date",
      roomIndex: currentRoomIndex,
    } as TSessionData;

    // Disable the buttons after room selection
    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: chatId, message_id: message.message_id },
    );
    await bot.sendMessage(chatId, i18next.t("enterCheckInDate"));
  }
};

export const handleBookOption: CallbackHandler = async ({
  bot,
  chatId,
  userSessions,
  message,
  currentRoomIndex,
}) => {
  if (userSessions && message) {
    const session = userSessions[chatId];
    const { serviceName } = session;
    const cleaningServices =
      isLaundryService(serviceName) || isExtraCleaningService(serviceName);

    if (isRestaurantBooking(serviceName)) {
      userSessions[chatId] = {
        ...userSessions[chatId],
        serviceBookingStage: "awaiting_restaurant_date",
      } as TSessionData;
    } else {
      userSessions[chatId] = {
        ...userSessions[chatId],
        serviceBookingStage: cleaningServices
          ? "awaiting_booked_room_number"
          : "awaiting_checkin_date",
        roomIndex: currentRoomIndex,
      } as TSessionData;
    }

    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: chatId, message_id: message.message_id },
    );
    if (cleaningServices) {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.enterRoomDetails"),
      );
    } else if (isRestaurantBooking(serviceName)) {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.restaurantBookDate"),
      );
    } else {
      await bot.sendMessage(chatId, i18next.t("enterCheckInDate"));
    }
  }
};

// Handler for continuing reservation (enter check-in/out dates)
export const handleContinueReservation: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  if (userSessions) {
    const session = userSessions[chatId];
    const nextAvailableDate = data.split("_")[2];
    session.checkInDate = nextAvailableDate;
    session.roomBookingStage = "awaiting_checkout_date";
    bot.sendMessage(chatId, i18next.t("enterCheckoutDate"));
  }
};

export const handleBookSpaOption: CallbackHandler = async ({
  bot,
  chatId,
  userSessions,
}) => {
  if (userSessions) {
    const session = userSessions[chatId];
    const optionName = session.option;
    const isOneDayProgram =
      session.programName === i18next.t("extraServices.oneDayPrograms");
    userSessions[chatId] = {
      ...userSessions[chatId],
      serviceBookingStage: "awaiting_checkin_date",
    };

    if (isOneDayProgram) {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.oneDayProgramsDate", { optionName }),
      );
    } else {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.threeDaysProgramsCheckIn", { optionName }),
      );
    }
  }
};

export const handleContinueReservationOption: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  if (userSessions) {
    const session = userSessions[chatId];
    const nextAvailableDate = data.split("_")[3];
    session.serviceBookingStage = "awaiting_first_name";
    session.checkInDate = nextAvailableDate;
    if (isSpaService(session.serviceName)) {
      session.checkOutDate = isOneDayProgram(session.programName)
        ? nextAvailableDate
        : formatDate(addThreeDaysToDate(nextAvailableDate).toDate());
    } else {
      const newCheckoutDate = addDaysToStartDate(
        nextAvailableDate,
        session.optionDuration,
      );
      const checkoutDateFormatted = formatDate(newCheckoutDate.toDate());
      session.checkOutDate = checkoutDateFormatted;
    }
    bot.sendMessage(
      chatId,
      i18next.t("extraServices.noteCheckoutDate", {
        checkoutDate: session.checkOutDate,
      }),
    );
    bot.sendMessage(chatId, i18next.t("enterFirstName"));
  }
};
