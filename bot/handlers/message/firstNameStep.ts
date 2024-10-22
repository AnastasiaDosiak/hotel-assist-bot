import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidName } from "../../common/validators";

export const firstNameStep = (
  props: CommonStepParams,
  bookingStageName: "serviceBookingStage" | "roomBookingStage",
) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  if (!isValidName(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidFirstName"));
  } else {
    session.firstName = msg.text!;
    session[bookingStageName] = "awaiting_last_name";
    bot.sendMessage(chatId, i18next.t("enterLastName"));
  }
};
