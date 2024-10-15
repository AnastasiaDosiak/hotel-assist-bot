import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { TRoomType, TUserSession } from "../common/types";
import { handleTextMessage } from "./messageHandler";

export const handleContactMessage = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  userSessions: TUserSession,
  rooms: TRoomType[],
  currentRoomTypeIndex: number,
  setCurrentRoomTypeIndex: (index: number) => void,
) => {
  const chatId = msg.chat.id;

  const phoneNumber = msg.contact?.phone_number;

  if (phoneNumber) {
    // Update session with phone number
    userSessions[chatId].phone = phoneNumber;

    // Move to the next stage and check room availability
    const session = userSessions[chatId];

    if (session && session.bookingStage === "awaiting_phone_number") {
      session.bookingStage = "check_availability";

      // Now we call the handler to check the availability and move the flow forward
      handleTextMessage(
        bot,
        msg,
        userSessions,
        rooms,
        currentRoomTypeIndex,
        setCurrentRoomTypeIndex,
      );
    } else {
      bot.sendMessage(chatId, i18next.t("bookingProcess.errorOccurred"));
    }
  } else {
    bot.sendMessage(chatId, i18next.t("bookingProcess.noContactInfoReceived"));
    console.error("No contact info received");
  }
};
