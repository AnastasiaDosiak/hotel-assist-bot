import TelegramBot from "node-telegram-bot-api";
import { TRoomType, TUserSession } from "../common/types";
import { sendOrUpdateRoomTypeDetails } from "../services/roomService";
import callbackHandlers from "./callbackHandlers";

export const handleCallbackQuery = (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  rooms: TRoomType[],
  userSessions: TUserSession,
  currentRoomIndex: number,
  setCurrentRoomIndex: (index: number) => number,
) => {
  const message = callbackQuery.message!;
  const data = callbackQuery.data!;
  const chatId = message.chat.id;
  let privateRoomIndex = currentRoomIndex;

  // First handle dynamic prefixes
  const prefixMatch = Object.keys(callbackHandlers).find((key) =>
    data.startsWith(key),
  );

  if (prefixMatch) {
    const handler = callbackHandlers[prefixMatch];
    handler({
      bot,
      chatId,
      data,
      userSessions,
      message,
      rooms,
      currentRoomIndex: privateRoomIndex,
    });
  }

  // Handle specific actions without dynamic prefixes
  switch (data) {
    case "next_room_type":
      if (currentRoomIndex < rooms.length - 1) {
        privateRoomIndex = currentRoomIndex + 1;
        setCurrentRoomIndex(currentRoomIndex + 1);
      }
      break;

    case "previous_room_type":
      if (currentRoomIndex > 0) {
        privateRoomIndex = currentRoomIndex - 1;
        setCurrentRoomIndex(currentRoomIndex - 1);
      }
      break;

    default:
      break;
  }

  const updateRoomMessage =
    data.includes("next_room_type") || data.includes("previous_room_type");
  if (updateRoomMessage) {
    sendOrUpdateRoomTypeDetails(
      bot,
      message.chat.id,
      message.message_id,
      privateRoomIndex,
      rooms,
    );
  } else if (
    data.includes("select_service_") ||
    data.includes("select_spa_option_") ||
    data.includes("select_spa_program_") ||
    data.includes("select_option_") ||
    data.includes("back_to_services") ||
    data.includes("select_question_") ||
    data.includes("back_to_questions") ||
    data.includes("leave_feedback") ||
    data.includes("awaiting_last_and_first_name") ||
    data.includes("skip_first_and_last_name") ||
    data.includes("rated_") ||
    data.includes("see_latest_feedbacks")
  ) {
    bot.editMessageReplyMarkup(
      { inline_keyboard: [] }, // Empty array to remove the keyboard
      { chat_id: chatId, message_id: message.message_id },
    );
  }
  bot.answerCallbackQuery(callbackQuery.id);
};
