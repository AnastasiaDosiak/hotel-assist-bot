import TelegramBot from "node-telegram-bot-api";
import { roomTypes } from "../backend/common/constants";
import { BOT_START_MESSAGE, TOKEN } from "./common/constants";
import { initI18n } from "../i18n";
import { TRoomType, TSessionData, TUserSession } from "./common/types";
import { messageCommand } from "./commands/message";
import { callbackCommand } from "./commands/callback";
import { contactCommand } from "./commands/contact";
import { startCommand } from "./commands/start";

const bot: TelegramBot = new TelegramBot(TOKEN, { polling: true });
const userSessions: TUserSession = {};
let currentRoomIndex = 0;

// Initialize i18n (localization)
initI18n();

// Prepare room data for the bot
const rooms = roomTypes.map((room) => ({
  type: room.type,
  imageUrl: room.imageUrl,
  price: room.price,
  guests: `${room.minGuests} - ${room.maxGuests}`,
})) as TRoomType[];

const commonParams = {
  bot,
  userSessions,
  rooms,
  currentRoomIndex,
  setCurrentRoomIndex: (index: number) => (currentRoomIndex = index),
};

// Handle /start command specifically
bot.on("text", (msg) => {
  if (msg.text?.match(BOT_START_MESSAGE)) {
    startCommand(commonParams).handler(msg);
  } else {
    messageCommand(commonParams).handler(msg);
  }
  // clear the session so user can start a new booking
  if (
    userSessions[msg.chat.id] &&
    userSessions[msg.chat.id].bookingstage &&
    userSessions[msg.chat.id].bookingstage === "booking_completed"
  ) {
    userSessions[msg.chat.id] = {} as TSessionData;
  }
});

// Handle callback queries
bot.on("callback_query", (callbackQuery) => {
  callbackCommand({ ...commonParams, currentRoomIndex }).handler(callbackQuery);
});

// Handle contact messages
bot.on("contact", (msg) => {
  contactCommand(commonParams).handler(msg);
});

bot.on("polling_error", console.log);
