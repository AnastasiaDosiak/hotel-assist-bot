import TelegramBot from "node-telegram-bot-api";
import { CommandParams } from "../common/types";
import { handleContactMessage } from "../handlers/contactHandler";

export const contactCommand = (commandParams: CommandParams) => {
  const { bot, userSessions, rooms, setCurrentRoomIndex } = commandParams;
  return {
    handler: (msg: TelegramBot.Message) => {
      handleContactMessage(bot, msg, userSessions, rooms, setCurrentRoomIndex);
    },
  };
};
