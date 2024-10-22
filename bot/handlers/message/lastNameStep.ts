import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidName } from "../../common/validators";

export const lastNameStep = (
  props: CommonStepParams,
  bookingStageName: "serviceBookingStage" | "roomBookingStage",
) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;
  if (!isValidName(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidLastName"));
  } else {
    session[bookingStageName] = "awaiting_phone_number";
    session.lastName = msg.text!;
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
};
