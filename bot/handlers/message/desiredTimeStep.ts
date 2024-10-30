import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidTime } from "../../common/validators";
import { checkRestaurantAvailability } from "../../services/bookingService";

export const desiredTimeStep = (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const { serviceName, option, checkInDate } = session;

  const chatId = msg.chat.id;
  if (!isValidTime(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidTimeFormat"));
  } else {
    session.restaurantBookedTime = msg.text!;
    checkRestaurantAvailability(
      serviceName,
      option,
      checkInDate,
      msg.text!,
    ).then(async (res) => {
      // some error occured, show it
      if (typeof res === "string") {
        await bot.sendMessage(chatId, res);
      } else {
        session.serviceBookingStage = "awaiting_first_name";
        await bot.sendMessage(chatId, i18next.t("enterFirstName"));
      }
    });
  }
};
