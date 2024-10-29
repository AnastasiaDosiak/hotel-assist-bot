import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isDateValidAndAfterNow } from "../../common/utils";

export const checkInStep = (props: CommonStepParams) => {
  const { msg, bot, rooms, session } = props;

  const chatId = msg.chat.id;
  const currentRoomTypeIndex = session.roomIndex;
  if (rooms) {
    session.roomType = rooms[currentRoomTypeIndex].type;
    if (!isDateValidAndAfterNow(msg.text!)) {
      bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
    } else {
      session.checkInDate = msg.text!;
      session.roomBookingStage = "awaiting_checkout_date";
      bot.sendMessage(chatId, i18next.t("enterCheckoutDate"));
    }
  }
};
