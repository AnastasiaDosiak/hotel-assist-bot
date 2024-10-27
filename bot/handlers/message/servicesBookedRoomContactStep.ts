import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidPhoneNumber } from "../../common/validators";

export const servicesBookedRoomContactStep = async (
  props: CommonStepParams,
) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  if (!isValidPhoneNumber(msg.text!)) {
    await bot.sendMessage(chatId, i18next.t("invalidPhoneNumber"));
  } else {
    session.serviceBookingStage = "awaiting_booked_checkin_date";
    session.phone = msg.text as string;
    await bot.sendMessage(chatId, i18next.t("extraServices.writeCheckInDate"));
  }
};
