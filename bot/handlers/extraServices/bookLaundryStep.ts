import i18next from "i18next";
import TelegramBot from "node-telegram-bot-api";
import { TSessionData } from "../../common/types";
import { findOptionByName, resetSession } from "../../common/utils";
import { bookLaundryOption } from "../../services/bookingService";

export const bookLaundryStep = async (
  bot: TelegramBot,
  chatId: number,
  session: TSessionData,
) => {
  const { serviceName, option, checkInDate, phone, roomNumber } = session;
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("bookRoom") }],
        [{ text: i18next.t("additionalServices") }],
        [{ text: i18next.t("feedback") }],
        [{ text: i18next.t("cityHelp") }],
        [{ text: i18next.t("faq") }],
      ],
      size_keyboard: true,
      one_time_keyboard: false,
    },
  };
  bookLaundryOption(
    serviceName,
    option,
    roomNumber as number,
    checkInDate,
    phone,
  )
    .then(() => {
      findOptionByName(option).then(async (response) => {
        await bot.sendMessage(
          chatId,
          i18next.t("extraServices.laundryServiceOptionConfirmation", {
            laundryOption: option,
            price: response?.price,
          }),
          options,
        );
        resetSession(session);
      });
    })
    .catch((error) => {
      bot.sendMessage(chatId, i18next.t("extraServices.bookingOptionError"));
      console.error(error);
    });
};
