import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidDate } from "../../common/utils";

export const checkInStep = (props: CommonStepParams) => {
  const { msg, bot, rooms, session } = props;

  const chatId = msg.chat.id;
  const currentRoomTypeIndex = session.roomIndex;
  session.roomType = rooms[currentRoomTypeIndex].type;
  if (!isValidDate(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("bookingProcess.invalidDateFormat"));
  } else {
    session.checkInDate = msg.text!;
    session.bookingstage = "awaiting_checkout_date";
    bot.sendMessage(chatId, i18next.t("bookingProcess.enterCheckoutDate"));
  }
};
