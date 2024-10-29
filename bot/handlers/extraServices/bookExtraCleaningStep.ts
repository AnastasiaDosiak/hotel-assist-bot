import i18next from "i18next";
import TelegramBot from "node-telegram-bot-api";
import { TSessionData } from "../../common/types";
import { bookExtraCleaningOption } from "../../services/bookingService";
import { resetSession } from "../../common/utils";

export const bookExtraCleaningStep = async (
  bot: TelegramBot,
  chatId: number,
  session: TSessionData,
) => {
  const { serviceName, option, phone, roomNumber, checkInDate } = session;
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("bookRoom") }],
        [{ text: i18next.t("additionalServices") }],
        [{ text: i18next.t("feedback") }],
        [{ text: i18next.t("faq") }],
      ],
      size_keyboard: true,
      one_time_keyboard: false,
    },
  };
  bookExtraCleaningOption(
    serviceName,
    option,
    roomNumber as number,
    phone,
    checkInDate,
  )
    .then(async (response) => {
      if (typeof response === "string") {
        await bot.sendMessage(chatId, response, options);
        resetSession(session);
      }
    })
    .catch((error) => {
      bot.sendMessage(chatId, i18next.t("extraServices.bookingOptionError"));
      console.error(error);
    });
};
