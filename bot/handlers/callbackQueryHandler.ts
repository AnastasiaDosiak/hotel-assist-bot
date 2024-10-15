import TelegramBot from "node-telegram-bot-api";
import { TRoomType, TUserSession } from "../common/types";
import { sendOrUpdateRoomTypeDetails } from "../services/roomService";
import callbackHandlers from "./ callbackHandlers";

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
      currentRoomTypeIndex,
    });
  }

  // Handle specific actions without dynamic prefixes
  switch (data) {
    case "next_room_type":
      if (currentRoomTypeIndex < rooms.length - 1) {
        newIndex = currentRoomTypeIndex + 1;
      }
      break;

    case "previous_room_type":
      if (currentRoomTypeIndex > 0) {
        newIndex = currentRoomTypeIndex - 1;
      }
      break;

    default:
      break;
  }

  // Log the comparison of old and new index
  if (newIndex !== currentRoomTypeIndex) {
    setCurrentRoomTypeIndex(newIndex);

    // Ensure the room details are updated based on the new index
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
