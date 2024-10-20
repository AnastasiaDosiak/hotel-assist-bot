import i18next from "i18next";
import { CallbackHandler, TSessionData } from "../common/types";

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
      bookingstage: "awaiting_checkin_date",
      roomIndex: currentRoomIndex,
    } as TSessionData;

    // Disable the buttons after room selection
    await bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: chatId, message_id: message.message_id },
    );
    await bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckInDate"));
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
    const nextAvailableDate = data.split("_")[2];
    userSessions[chatId].checkInDate = nextAvailableDate;
    userSessions[chatId].bookingstage = "awaiting_checkout_date";
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckoutDate"));
  }
};

export const handleBookOption: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  if (userSessions) {
    // TODO: add some logic here
    // const nextAvailableDate = data.split("_")[2];
    // userSessions[chatId].checkInDate = nextAvailableDate;
    // userSessions[chatId].bookingstage = "awaiting_checkout_date";
    // bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckoutDate"));
  }
};
