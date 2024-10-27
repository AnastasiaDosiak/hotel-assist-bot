import i18next from "i18next";
import { getSpaOptionDetails, resetSession } from "../../common/utils";
import { bookSpaProgramOption } from "../../services/bookingService";
import TelegramBot from "node-telegram-bot-api";
import { TSessionData, TUserBookingData } from "../../common/types";

export const bookSpaProgramOptionStep = async (
  bot: TelegramBot,
  chatId: number,
  session: TSessionData,
  bookingData: TUserBookingData,
) => {
  const {
    serviceName,
    option,
    programName,
    checkInDate,
    lastName,
    phone,
    checkOutDate,
    firstName,
  } = session;
  const options = {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("bookRoom") }],
        [{ text: i18next.t("additionalServices") }],
        [{ text: i18next.t("feedback") }],
        [{ text: i18next.t("cityHelp") }],
        [{ text: i18next.t("checkInOut") }],
      ],
      size_keyboard: true,
      one_time_keyboard: false,
    },
  };
  bookSpaProgramOption(serviceName, programName, option, bookingData)
    .then(() => {
      getSpaOptionDetails(programName, option).then(async (response) => {
        await bot.sendMessage(
          chatId,
          i18next.t("extraServices.bookingOptionConfirmation", {
            optionName: option,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice: response?.price,
            firstName,
            lastName,
            phone,
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
