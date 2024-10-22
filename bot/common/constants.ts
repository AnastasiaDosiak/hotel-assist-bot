import dotenv from "dotenv";
import i18next from "i18next";

dotenv.config();

export const TOKEN: string = process.env.TELEGRAM_TOKEN as string;

export const DATE_FORMAT = "DD/MM/YYYY";

export const BOT_START_MESSAGE = /\/start/;

export const isOneDayProgram = (programName: string) =>
  i18next.t("extraServices.oneDayPrograms") === programName;
