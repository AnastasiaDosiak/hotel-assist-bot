import i18next from "i18next";
import {
  findOptionByName,
  addDaysToStartDate,
  formatDate,
} from "../../common/utils";
import { dateRegex } from "../../common/validators";
import { checkOptionAvailability } from "../../services/bookingService";
import { TSessionData } from "../../common/types";
import TelegramBot from "node-telegram-bot-api";

export const checkCleaningAvailabilityStep = async (
  optionName: string,
  messageText: string,
  session: TSessionData,
  serviceName: string,
  bot: TelegramBot,
  chatId: number,
) => {
  const optionDetails = await findOptionByName(optionName);
  const checkoutDate = addDaysToStartDate(
    messageText,
    optionDetails?.duration as number,
  );
  const checkoutDateFormatted = formatDate(checkoutDate.toDate());
  session.checkOutDate = checkoutDateFormatted;
  session.optionDuration = optionDetails?.duration as number;
  await checkOptionAvailability(
    serviceName,
    optionName,
    session.checkInDate,
    session.checkOutDate,
  ).then((response) => {
    if (typeof response === "string") {
      // If service is unavailable, send options to the user
      const nextAvailableDate = response.match(dateRegex);
      const nextAvailableDateMatch = nextAvailableDate
        ? nextAvailableDate[0]
        : null;
      if (nextAvailableDateMatch) {
        session.checkInDate = nextAvailableDate!.toString();
        bot.sendMessage(chatId, response, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: i18next.t("extraServices.continueReservation", {
                    nextAvailableDate,
                  }),
                  callback_data: `continue_reserve_option_${nextAvailableDate}`,
                },
                {
                  text: i18next.t("extraServices.backToServices"),
                  callback_data: "back_to_services",
                },
              ],
            ],
          },
        });
      }
    } else {
      session.checkOutDate = formatDate(checkoutDate.toDate());
      bot.sendMessage(
        chatId,
        i18next.t("extraServices.noteCheckoutDate", {
          checkoutDate: formatDate(checkoutDate.toDate()),
        }),
      );
      bot.sendMessage(chatId, i18next.t("enterFirstName"));
      session.serviceBookingStage = "awaiting_first_name";
    }
  });
};
