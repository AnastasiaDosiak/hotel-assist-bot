import TelegramBot from "node-telegram-bot-api";
import { CommandParams } from "../common/types";
import i18next from "i18next";

export const startCommand = (commandParams: CommandParams) => {
  const { bot } = commandParams;
  return {
    handler: (msg: TelegramBot.Message) => {
      const chatId = msg.chat.id;
      const options = {
        reply_markup: {
          keyboard: [
            [{ text: i18next.t("bookRoom") }],
            [{ text: i18next.t("additionalServices") }],
            [{ text: i18next.t("feedback") }],
            [{ text: i18next.t("cityHelp") }],
            [{ text: i18next.t("checkInOut") }],
          ],
          resize_keyboard: true,
          one_time_keyboard: false,
        },
      };
      bot.sendMessage(chatId, i18next.t("startMessage"), options);
    },
  };
};
