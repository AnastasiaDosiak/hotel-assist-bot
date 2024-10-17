import TelegramBot from "node-telegram-bot-api";
import { CommandParams } from "../common/types";
import { handleTextMessage } from "../handlers/message";

export const messageCommand = (commandParams: CommandParams) => {
  const { bot, userSessions, rooms, setCurrentRoomIndex } = commandParams;
  return {
    handler: (msg: TelegramBot.Message) => {
      handleTextMessage(bot, msg, userSessions, rooms, setCurrentRoomIndex);
    },
  };
};
