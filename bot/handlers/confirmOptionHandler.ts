import i18next from "i18next";
import { CommonStepParams } from "../common/types";
import {
  getSpaOptionDetails,
  isSpaService,
  resetSession,
} from "../common/utils";
import {
  gatherBookingData,
  bookSpaProgramOption,
  bookProgramOption,
} from "../services/bookingService";

export const confirmOptionStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
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
      size_keyboard: true,
      one_time_keyboard: false,
    },
  };

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

  if (serviceName) {
    const bookingData = gatherBookingData(chatId, session);

    if (isSpaService(serviceName)) {
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
          bot.sendMessage(
            chatId,
            i18next.t("extraServices.bookingOptionError"),
          );
          console.error(error);
        });
    } else {
      bookProgramOption(serviceName, programName, option, bookingData).then(
        async (res) => {
          await bot.sendMessage(
            chatId,
            i18next.t("extraServices.bookingOptionConfirmation", {
              optionName: option,
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
    }
  } else {
    bot.sendMessage(chatId, i18next.t("extraServices.noOptionsAvailable"));
    console.error("No available options found in session");
  }
};
