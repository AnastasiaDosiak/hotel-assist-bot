import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidDate } from "../../common/utils";
import { checkProvidedUserDataInRoom } from "../../services/bookingService";
import { confirmOptionStep } from "../confirmOptionHandler";

export const servicesBookedCheckInStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  const commonStepParams = {
    msg,
    bot,
    session,
  };

  if (!isValidDate(msg.text!)) {
    await bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
  } else {
    checkProvidedUserDataInRoom(
      session.roomNumber as number,
      session.phone,
      msg.text!,
    ).then(async (res) => {
      // some error appear, send
      if (typeof res === "string") {
        await bot.sendMessage(chatId, res);
      } else {
        session.checkInDate = msg.text!;
        session.serviceBookingStage = "confirm_step";
        await confirmOptionStep(commonStepParams);
      }
    });
  }
};
