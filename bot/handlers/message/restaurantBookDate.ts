import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isDateValidAndAfterNow } from "../../common/utils";

export const restaurantBookDate = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  if (!isDateValidAndAfterNow(msg.text!)) {
    await bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
  } else {
    session.checkInDate = msg.text!;
    session.serviceBookingStage = "awaiting_desired_time";
    await bot.sendMessage(
      chatId,
      i18next.t("extraServices.restaurantDesiredTime"),
    );
  }
};
