import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidFullName } from "../../common/validators";

export const enterFirstAndLastNameStep = (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  if (!isValidFullName(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidFullName"));
  } else {
    session.fullName = msg.text!;
    session.ratingStage = "awaiting_rate_hotel";
    bot.sendMessage(chatId, i18next.t("feedbackSection.rateHotel"), {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [{ text: "⭐", callback_data: "rated_1" }],
          [{ text: "⭐⭐", callback_data: "rated_2" }],
          [{ text: "⭐⭐⭐", callback_data: "rated_3" }],
          [{ text: "⭐⭐⭐⭐", callback_data: "rated_4" }],
          [{ text: "⭐⭐⭐⭐⭐", callback_data: "rated_5" }],
        ],
      },
    });
  }
};
