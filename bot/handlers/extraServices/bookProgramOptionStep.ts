import i18next from "i18next";
import { TSessionData, TUserBookingData } from "../../common/types";
import { resetSession } from "../../common/utils";
import { bookProgramOption } from "../../services/bookingService";
import TelegramBot from "node-telegram-bot-api";

export const bookProgramOptionStep = async (
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
  bookProgramOption(serviceName, programName, option, bookingData).then(
    async (res) => {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.bookingOptionConfirmation", {
          option,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          totalPrice: res?.price,
          firstName,
          lastName,
          phone,
        }),
        options,
      );
      resetSession(session);
    },
  );
};
