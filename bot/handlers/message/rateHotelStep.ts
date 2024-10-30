import i18next from "i18next";
import { CommonStepParams } from "../../common/types";

export const rateHotelStep = (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  session.ratingStage = "awaiting_leave_comment";
  session.rating = msg.text;

  bot.sendMessage(chatId, i18next.t("feedbackSection.leaveComment"));
};
