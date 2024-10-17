import TelegramBot from "node-telegram-bot-api";
import { CommandParams } from "../common/types";
import { handleCallbackQuery } from "../handlers/callbackQueryHandler";

export const callbackCommand = (commandParams: CommandParams) => {
  const { bot, userSessions, rooms, currentRoomIndex, setCurrentRoomIndex } =
    commandParams;
  return {
    handler: (callbackQuery: TelegramBot.CallbackQuery) => {
      handleCallbackQuery(
        bot,
        callbackQuery,
        rooms,
        userSessions,
        currentRoomIndex,
        setCurrentRoomIndex,
      );
    },
  };
};
