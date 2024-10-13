import TelegramBot from "node-telegram-bot-api";
import { roomTypes } from "../backend/common/constants";
import { BOT_START_MESSAGE, TOKEN } from "./common/constants";
import { handleTextMessage, handleCallbackQuery } from "./handlers";
import i18next from "i18next";
import { initI18n } from "./i18n";
import { TRoomType, TUserSession } from "./common/types";

const bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });

let currentRoomTypeIndex = 0;
const userSessions: TUserSession = {};

initI18n();

const rooms = roomTypes.map((room) => {
  return {
    type: room.type,
    imageUrl: room.imageUrl,
    price: room.price,
    guests: `${room.minGuests} - ${room.maxGuests}`,
  };
}) as TRoomType[];

bot.onText(BOT_START_MESSAGE, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("bookRoom") }],
        [{ text: i18next.t("infoServices") }],
        [{ text: i18next.t("clientSupport") }],
        [{ text: i18next.t("additionalServices") }],
        [{ text: i18next.t("messagesAndReminders") }],
        [{ text: i18next.t("feedback") }],
        [{ text: i18next.t("cityHelp") }],
        [{ text: i18next.t("checkInOut") }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };

  bot.sendMessage(chatId, i18next.t("startMessage"), options);
});
bot.on("message", (msg) => {
  return handleTextMessage(bot, msg, userSessions, rooms, currentRoomTypeIndex);
});

bot.on("callback_query", (callbackQuery) =>
  handleCallbackQuery(
    bot,
    callbackQuery,
    rooms,
    currentRoomTypeIndex,
    (index) => (currentRoomTypeIndex = index),
    userSessions,
  ),
);
