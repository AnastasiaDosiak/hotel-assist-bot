import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { sendOrUpdateRoomTypeDetails } from "../services/roomService";
import {
  checkRoomAvailability,
  bookRoom,
  gatherBookingData,
} from "../services/bookingService";
import {
  isValidDate,
  isCheckoutDateValid,
  getDifferenceInDays,
} from "../common/utils";
import { TRoomType, TUserSession } from "../common/types";
import { dateRegex, isValidName } from "../common/validators";
import { defaultOptions } from "../common/constants";

export const handleTextMessage = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  userSessions: TUserSession,
  rooms: TRoomType[],
  currentRoomTypeIndex: number,
) => {
  const chatId = msg.chat.id;
  const session = userSessions[chatId];

  if (!session?.bookingStage) {
    if (msg.text === i18next.t("bookRoom")) {
      sendOrUpdateRoomTypeDetails(bot, chatId, null, 0, rooms);
    }
  } else if (session.bookingStage === "awaiting_checkin_date") {
    userSessions[chatId].roomType = rooms[currentRoomTypeIndex].type;
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
    } else {
      userSessions[chatId].checkInDate = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_checkout_date";
      bot.sendMessage(chatId, i18next.t("enterCheckoutDate"));
    }
  } else if (session.bookingStage === "awaiting_checkout_date") {
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
    } else if (
      !isCheckoutDateValid(userSessions[chatId].checkInDate, msg.text!)
    ) {
      bot.sendMessage(chatId, i18next.t("checkoutEarlierThanCheckin"));
    } else {
      userSessions[chatId].checkOutDate = msg.text!;
      const roomType = rooms[currentRoomTypeIndex].type;

      // Perform the room availability check once after both dates are entered
      checkRoomAvailability(
        roomType,
        userSessions[chatId].checkInDate,
        userSessions[chatId].checkOutDate,
      )
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
                        text: i18next.t("continueReservation", {
                          nextAvailableDate,
                        }),
                        callback_data: `continue_reservation_${nextAvailableDate}`,
                      },
                      {
                        text: i18next.t("seeOtherRooms"),
                        callback_data: "see_other_rooms",
                      },
                    ],
                  ],
                },
              });
            }
          } else if (response) {
            // If room is available, proceed with gathering user details
            userSessions[chatId].availableRoomId = response.id; // Store available room id in the session
            userSessions[chatId].bookingStage = "awaiting_first_name";
            bot.sendMessage(chatId, i18next.t("enterFirstName"));
          } else {
            console.log("response: ", response);
            bot.sendMessage(chatId, i18next.t("noRoomsAvailable"));
            delete userSessions[chatId];
          }
        })
        .catch((error) => {
          bot.sendMessage(chatId, i18next.t("errorOccurred"));
          console.error(error);
        });
    }
  } else if (session.bookingStage === "awaiting_first_name") {
    if (!isValidName(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidFirstName"));
    } else {
      userSessions[chatId].firstName = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_last_name";
      bot.sendMessage(chatId, i18next.t("enterLastName"));
    }
  } else if (session.bookingStage === "awaiting_last_name") {
    if (!isValidName(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidLastName"));
    } else {
      userSessions[chatId].bookingStage = "awaiting_phone_number";
      bot.sendMessage(chatId, i18next.t("sharePhoneNumber"), {
        reply_markup: {
          keyboard: [
            [
              {
                text: i18next.t("shareContact"),
                request_contact: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
      });
    }
  } else if (session.bookingStage === "check_availability") {
    // Retrieve the available room that was checked earlier
    const availableRoomId = userSessions[chatId].availableRoomId;
    if (availableRoomId) {
      const bookingData = gatherBookingData(chatId, userSessions);

      bookRoom(availableRoomId, bookingData)
        .then(() => {
          const totalDays = getDifferenceInDays(
            userSessions[chatId].checkInDate,
            userSessions[chatId].checkOutDate,
          );
          const totalPrice = totalDays * rooms[currentRoomTypeIndex].price;

          bot.sendMessage(
            chatId,
            i18next.t("bookingConfirmation", {
              roomType: userSessions[chatId].roomType,
              checkIn: userSessions[chatId].checkInDate,
              checkOut: userSessions[chatId].checkOutDate,
              totalDays,
              totalPrice,
              firstName: userSessions[chatId].firstName,
              lastName: userSessions[chatId].lastName,
              phone: userSessions[chatId].phone,
            }),
            defaultOptions,
          );
          delete userSessions[chatId]; // Clear session after booking is complete
        })
        .catch((error) => {
          bot.sendMessage(chatId, i18next.t("bookingError"));
          console.error(error);
        });
    } else {
      bot.sendMessage(chatId, i18next.t("noRoomsAvailable"));
      console.error("No available room found in session");
    }
  }
};
