import dotenv from "dotenv";
import i18next from "i18next";

dotenv.config();

export const TOKEN: string = process.env.TELEGRAM_TOKEN as string;

export const DATE_FORMAT = "DD/MM/YYYY";

export const BOT_START_MESSAGE = /\/start/;

export const defaultOptions = {
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
