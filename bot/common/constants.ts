import dotenv from "dotenv";

dotenv.config();

export const TOKEN: string = process.env.TELEGRAM_TOKEN as string;

export const DATE_FORMAT = "DD/MM/YYYY";

export const BOT_START_MESSAGE = /\/start/;
