import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { saveFeedback } from "../../services/feedbackService";
import { resetSession } from "../../common/utils";

export const leaveCommentStep = (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  saveFeedback(
    session.rating as string,
    session.fullName as string,
    msg.text as string,
  )
    .then(async () => {
      await bot.sendMessage(chatId, i18next.t("feedbackSection.feebackSaved"));
      resetSession(session);
    })
    .catch(async (e) => {
      console.log("error is", e);
      await bot.sendMessage(
        chatId,
        i18next.t("feedbackSection.errorDurinFeedbackSaving"),
      );
    });
};
