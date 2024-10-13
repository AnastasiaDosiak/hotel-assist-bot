import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { sendOrUpdateRoomTypeDetails } from "./botActions";
import {
  bookRoom,
  checkRoomAvailability,
  getDifferenceInDays,
  isCheckoutDateValid,
  isValidDate,
} from "./common/utils";
import { isValidName, isValidPhoneNumber } from "./common/validators";
import { TRoomType, TUserSessions } from "./common/types";

export const handleTextMessage = (
  bot: TelegramBot,
  chatId: number,
  msg: TelegramBot.Message,
  userSessions: TUserSessions,
  rooms: TRoomType[],
  currentRoomTypeIndex: number,
) => {
  const session = userSessions[chatId];

  if (!session?.bookingStage) {
    if (msg.text === i18next.t("bookRoom")) {
      sendOrUpdateRoomTypeDetails(
        bot,
        chatId,
        null,
        rooms[currentRoomTypeIndex],
        currentRoomTypeIndex,
        rooms,
      );
    }
  } else if (session.bookingStage === "awaiting_checkin_date") {
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
    } else {
      userSessions[chatId].checkInDate = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_checkout_date";
      bot.sendMessage(chatId, i18next.t("enterCheckoutDate"));
    }
  } else if (session.bookingStage === "awaiting_checkout_date") {
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidCheckoutDate"));
    } else if (
      !isCheckoutDateValid(userSessions[chatId].checkInDate!, msg.text!)
    ) {
      bot.sendMessage(chatId, i18next.t("checkoutEarlierThanCheckin"));
    } else {
      userSessions[chatId].checkOutDate = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_first_name";
      bot.sendMessage(chatId, i18next.t("enterFirstName"));
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
      userSessions[chatId].lastName = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_phone_number";
      bot.sendMessage(chatId, i18next.t("enterPhoneNumber"));
    }
  } else if (session.bookingStage === "awaiting_phone_number") {
    if (!isValidPhoneNumber(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidPhoneNumber"));
    } else {
      userSessions[chatId].phone = msg.text!;
      const roomType = rooms[currentRoomTypeIndex].type;

      checkRoomAvailability(
        roomType,
        userSessions[chatId].checkInDate!,
        userSessions[chatId].checkOutDate!,
      ).then((availableRoom) => {
        if (availableRoom) {
          const bookingData = {
            userId: chatId.toString(),
            phone: userSessions[chatId].phone,
            firstName: userSessions[chatId].firstName,
            lastName: userSessions[chatId].lastName,
            startDate: userSessions[chatId].checkInDate!,
            endDate: userSessions[chatId].checkOutDate!,
          };

          bookRoom(availableRoom, bookingData).then(() => {
            const totalDays = getDifferenceInDays(
              userSessions[chatId].checkInDate,
              userSessions[chatId].checkOutDate,
            );
            const totalNights = totalDays === 1 ? totalDays : totalDays - 1;
            const totalPrice = totalDays * rooms[currentRoomTypeIndex].price;

            bot.sendMessage(
              chatId,
              i18next.t("bookingConfirmation", {
                roomType,
                checkIn: userSessions[chatId].checkInDate,
                checkOut: userSessions[chatId].checkOutDate,
                totalNights,
                totalPrice,
                firstName: userSessions[chatId].firstName,
                lastName: userSessions[chatId].lastName,
                phone: userSessions[chatId].phone,
              }),
            );
            delete userSessions[chatId];
          });
        } else {
          bot.sendMessage(chatId, i18next.t("noRoomsAvailable"));
          delete userSessions[chatId];
        }
      });
    }
  }
};

export const handleCallbackQuery = (
  bot: TelegramBot,
  callbackQuery: TelegramBot.CallbackQuery,
  rooms: TRoomType[],
  currentRoomTypeIndex: number,
  setCurrentRoomTypeIndex: (index: number) => void,
) => {
  const message = callbackQuery.message!;
  const data = callbackQuery.data!;

  let newIndex = currentRoomTypeIndex;

  if (data === "next_room_type" && currentRoomTypeIndex < rooms.length - 1) {
    newIndex = currentRoomTypeIndex + 1;
  } else if (data === "previous_room_type" && currentRoomTypeIndex > 0) {
    newIndex = currentRoomTypeIndex - 1;
  }

  if (newIndex !== currentRoomTypeIndex) {
    setCurrentRoomTypeIndex(newIndex);

    sendOrUpdateRoomTypeDetails(
      bot,
      message.chat.id,
      message.message_id,
      rooms[newIndex], // pass the updated index
      newIndex, // updated room type index
      rooms,
    );
  } else {
    // Optionally send a message indicating that the user has reached the start or end
    bot.answerCallbackQuery(callbackQuery.id, { text: "No more rooms." });
  }

  bot.answerCallbackQuery(callbackQuery.id);
};
