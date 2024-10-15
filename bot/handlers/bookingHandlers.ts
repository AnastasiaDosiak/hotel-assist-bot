import i18next from "i18next";
import { CallbackHandler, TSessionData } from "../common/types";

// Handler for room booking
export const handleBookRoom: CallbackHandler = ({
  bot,
  chatId,
  userSessions,
  message,
}) => {
  if (userSessions && message) {
    userSessions[chatId] = {
      bookingStage: "awaiting_checkin_date",
    } as TSessionData;

    // Disable the buttons after room selection
    bot.editMessageReplyMarkup(
      { inline_keyboard: [] },
      { chat_id: chatId, message_id: message.message_id },
    );
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckInDate"));
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
    userSessions[chatId].bookingStage = "awaiting_checkout_date";
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckoutDate"));
  }
};
