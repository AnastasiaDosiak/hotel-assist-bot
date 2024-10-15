import TelegramBot from "node-telegram-bot-api";
import { sendOrUpdateRoomTypeDetails } from "../services/roomService";
import { TRoomType, TSessionData, TUserSession } from "../common/types";
import i18next from "i18next";
import {
  handleProgramSelection,
  handleServiceCategory,
} from "./extraServicesHandler";

export const handleCallbackQuery = (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  rooms: TRoomType[],
  currentRoomTypeIndex: number,
  setCurrentRoomTypeIndex: (index: number) => void,
  userSessions: TUserSession,
) => {
  const message = callbackQuery.message!;
  const data = callbackQuery.data!;
  const chatId = message.chat.id;

  let newIndex = currentRoomTypeIndex;

  if (data.startsWith("select_service_")) {
    const serviceName = data.replace("select_service_", "");
    handleServiceCategory(bot, callbackQuery.message!.chat.id, serviceName);
  } else if (data.startsWith("select_program_")) {
    const programName = data.replace("select_program_", "");
    handleProgramSelection(bot, callbackQuery.message!.chat.id, programName);
  } else if (
    data === "next_room_type" &&
    currentRoomTypeIndex < rooms.length - 1
  ) {
    newIndex = currentRoomTypeIndex + 1;
  } else if (data === "previous_room_type" && currentRoomTypeIndex > 0) {
    newIndex = currentRoomTypeIndex - 1;
  } else if (data.startsWith("book_room_type_")) {
    // Start the booking process
    userSessions[chatId] = {
      bookingStage: "awaiting_checkin_date",
    } as TSessionData;

    // Disable the buttons after room selection
    bot.editMessageReplyMarkup(
      {
        inline_keyboard: [],
      },
      {
        chat_id: chatId,
        message_id: message.message_id,
      },
    );
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckInDate"));
  } else if (data.startsWith("continue_reservation_")) {
    const nextAvailableDate = data.split("_")[2];
    userSessions[chatId].checkInDate = nextAvailableDate;
    userSessions[chatId].bookingStage = "awaiting_checkout_date";
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckoutDate"));
  } else if (data === "see_other_rooms") {
    sendOrUpdateRoomTypeDetails(bot, chatId, null, currentRoomTypeIndex, rooms);
  }

  if (newIndex !== currentRoomTypeIndex) {
    setCurrentRoomTypeIndex(newIndex);

    sendOrUpdateRoomTypeDetails(
      bot,
      message.chat.id,
      message.message_id,
      newIndex,
      rooms,
    );
  }

  bot.answerCallbackQuery(callbackQuery.id);
};
