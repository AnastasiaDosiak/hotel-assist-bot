import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import {
  addThreeDaysToDate,
  formatDate,
  isValidDate,
} from "../../common/utils";
import { dateRegex } from "../../common/validators";
import { isOneDayProgram } from "../../common/constants";
import { checkOptionAvailability } from "../../services/bookingService";

export const servicesCheckinStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const { serviceName, programName, option } = session;
  const chatId = msg.chat.id;
  if (!isValidDate(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
  } else {
    session.checkInDate = msg.text!;
    const checkoutDateForThreeDays = addThreeDaysToDate(msg.text!);
    const checkoutDate = isOneDayProgram(programName)
      ? msg.text!
      : formatDate(checkoutDateForThreeDays.toDate());
    await checkOptionAvailability(
      serviceName,
      session.checkInDate,
      programName,
      option,
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
            i18next.t("extraServices.threeDaysProgramsCheckoutDate", {
              checkoutDate: checkoutDate,
            }),
          );
        }
        session.checkOutDate = checkoutDate;
        bot.sendMessage(chatId, i18next.t("enterFirstName"));
        session.serviceBookingStage = "awaiting_first_name";
      }
    });
  }
};
