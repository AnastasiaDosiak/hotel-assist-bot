import i18next from "i18next";
import { isOneDayProgram } from "../../common/constants";
import { addThreeDaysToDate, formatDate } from "../../common/utils";
import { dateRegex } from "../../common/validators";
import { checkSpaOptionAvailability } from "../../services/bookingService";
import TelegramBot from "node-telegram-bot-api";
import { TSessionData } from "../../common/types";

export const checkSpaOptionAvailabilityStep = async (
  serviceName: string,
  messageText: string,
  programName: string,
  checkInDate: string,
  optionName: string,
  bot: TelegramBot,
  chatId: number,
  session: TSessionData,
) => {
  const checkoutDateForThreeDays = addThreeDaysToDate(messageText);
  const checkoutDate = isOneDayProgram(programName)
    ? messageText
    : formatDate(checkoutDateForThreeDays.toDate());
  await checkSpaOptionAvailability(
    serviceName,
    checkInDate,
    programName,
    optionName,
  ).then((response) => {
    if (typeof response === "string") {
      // If service is unavailable, send options to the user
      const nextAvailableDate = response.match(dateRegex);
      const nextAvailableDateMatch = nextAvailableDate
        ? nextAvailableDate[0]
        : null;
      if (nextAvailableDateMatch) {
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
      if (!isOneDayProgram(programName)) {
        // Perform the room availability check once after both dates are entered
        bot.sendMessage(
          chatId,
          i18next.t("extraServices.noteCheckoutDate", {
            checkoutDate: checkoutDate,
          }),
        );
      }
      session.checkOutDate = checkoutDate;
      bot.sendMessage(chatId, i18next.t("enterFirstName"));
      session.serviceBookingStage = "awaiting_first_name";
    }
  });
};
