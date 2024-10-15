import TelegramBot from "node-telegram-bot-api";
import { roomTypes } from "../backend/common/constants";
import { BOT_START_MESSAGE, TOKEN } from "./common/constants";
import { handleTextMessage } from "./handlers/messageHandler";
import { handleCallbackQuery } from "./handlers/callbackQueryHandler";
import { handleContactMessage } from "./handlers/contactHandler";
import { initI18n } from "../i18n";
import { TRoomType, TUserSession } from "./common/types";
import i18next from "i18next";

const bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });
let currentRoomTypeIndex = 0;
const userSessions: TUserSession = {};

// Initialize i18n (localization)
initI18n();

// Prepare room data for the bot
const rooms = roomTypes.map((room) => ({
  type: room.type,
  imageUrl: room.imageUrl,
  price: room.price,
  guests: `${room.minGuests} - ${room.maxGuests}`,
})) as TRoomType[];

// Handle /start command
bot.onText(BOT_START_MESSAGE, (msg) => {
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
});

// Handle standard messages
bot.on("message", (msg) => {
  handleTextMessage(bot, msg, userSessions, rooms, currentRoomTypeIndex);
});

// Handle callback queries (from inline buttons)
bot.on("callback_query", (callbackQuery) => {
  handleCallbackQuery(
    bot,
    callbackQuery,
    rooms,
    currentRoomTypeIndex,
    (index) => (currentRoomTypeIndex = index),
    userSessions,
  );
});

// Handle contact information sharing (e.g., phone numbers)
bot.on("contact", (msg) => {
  handleContactMessage(bot, msg, userSessions, rooms, currentRoomTypeIndex);
});
