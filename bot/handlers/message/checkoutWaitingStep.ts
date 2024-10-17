import i18next from "i18next";
import {
  isValidDate,
  isCheckoutDateValid,
  resetSession,
} from "../../common/utils";
import { dateRegex } from "../../common/validators";
import { checkRoomAvailability } from "../../services/bookingService";
import { CommonStepParams } from "../../common/types";

export const checkoutWaitingStep = (props: CommonStepParams) => {
  const { msg, bot, rooms, session } = props;
  const chatId = msg.chat.id;
  if (!isValidDate(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("bookingProcess.invalidDateFormat"));
  } else if (!isCheckoutDateValid(session.checkInDate, msg.text!)) {
    bot.sendMessage(
      msg.chat.id,
      i18next.t("bookingProcess.checkoutEarlierThanCheckin"),
    );
  } else {
    session.checkOutDate = msg.text!;
    const currentRoomTypeIndex = session.roomIndex;
    const roomType = rooms[currentRoomTypeIndex].type;

    // Perform the room availability check once after both dates are entered
    checkRoomAvailability(roomType, session.checkInDate, session.checkOutDate)
      .then((response) => {
        if (typeof response === "string") {
          // If room is unavailable, send options to the user
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
                      text: i18next.t("bookingProcess.continueReservation", {
                        nextAvailableDate,
                      }),
                      callback_data: `continue_reservation_${nextAvailableDate}`,
                    },
                    {
                      text: i18next.t("bookingProcess.seeOtherRooms"),
                      callback_data: "see_other_rooms",
                    },
                  ],
                ],
              },
            });
          }
        } else if (response) {
          // If room is available, proceed with gathering user details
          session.availableRoomId = response.id; // Store available room id in the session
          session.bookingstage = "awaiting_first_name";
          bot.sendMessage(chatId, i18next.t("bookingProcess.enterFirstName"));
        } else {
          console.log("response: ", response);
          resetSession(session);
          bot.sendMessage(chatId, i18next.t("bookingProcess.noRoomsAvailable"));
        }
      })
      .catch((error) => {
        bot.sendMessage(chatId, i18next.t("bookingProcess.errorOccurred"));
        console.error(error);
      });
  }
};
