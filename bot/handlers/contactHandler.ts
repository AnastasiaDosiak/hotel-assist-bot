import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { TRoomType, TUserSession } from "../common/types";
import { handleTextMessage } from "./message";

export const handleContactMessage = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  userSessions: TUserSession,
  rooms: TRoomType[],
  setCurrentRoomIndex: (index: number) => number,
) => {
  const chatId = msg.chat.id;
  const session = userSessions[chatId];
  const phoneNumber = msg.contact?.phone_number;

  if (phoneNumber) {
    // Update session with phone number
    session.phone = phoneNumber;

    // Move to the next step and check room availability
    if (session) {
      if (session.roomBookingStage === "awaiting_phone_number") {
        session.roomBookingStage = "confirm_step";

        // Now we call the handler to check the availability and move the flow forward
        handleTextMessage(bot, msg, userSessions, rooms, setCurrentRoomIndex);
      } else if (session.serviceBookingStage === "awaiting_phone_number") {
        session.serviceBookingStage = "confirm_step";
        handleTextMessage(bot, msg, userSessions, rooms, setCurrentRoomIndex);
      } else {
        bot.sendMessage(chatId, i18next.t("bookingProcess.errorOccurred"));
      }
    }
  } else {
    bot.sendMessage(chatId, i18next.t("noContactInfoReceived"));
    console.error("No contact info received");
  }
};
