import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { getDifferenceInDays, resetSession } from "../../common/utils";
import { gatherBookingData, bookRoom } from "../../services/bookingService";

export const confirmStep = (props: CommonStepParams) => {
  const { msg, bot, session, rooms } = props;
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      keyboard: [
        [{ text: i18next.t("bookRoom") }],
        [{ text: i18next.t("additionalServices") }],
        [{ text: i18next.t("feedback") }],
        [{ text: i18next.t("faq") }],
      ],
      size_keyboard: true,
      one_time_keyboard: false,
    },
  };
  // Retrieve the available room that was checked earlier
  const availableRoomId = session.availableRoomId;
  if (availableRoomId) {
    const bookingData = gatherBookingData(chatId, session);

    bookRoom(availableRoomId, bookingData)
      .then(() => {
        const totalDays = getDifferenceInDays(
          session.checkInDate,
          session.checkOutDate,
        );
        const currentRoomTypeIndex = session.roomIndex;
        if (rooms) {
          const totalPrice = totalDays * rooms[currentRoomTypeIndex].price;
          bot.sendMessage(
            chatId,
            i18next.t("bookingProcess.bookingConfirmation", {
              roomType: session.roomType,
              checkIn: session.checkInDate,
              checkOut: session.checkOutDate,
              totalDays,
              totalPrice,
              firstName: session.firstName,
              lastName: session.lastName,
              phone: session.phone,
            }),
            options,
          );
          resetSession(session);
        }
      })
      .catch((error) => {
        bot.sendMessage(chatId, i18next.t("bookingProcess.bookingError"));
        console.error(error);
      });
  } else {
    bot.sendMessage(chatId, i18next.t("bookingProcess.noRoomsAvailable"));
    console.error("No available room found in session");
  }
};
