import i18next from "i18next";
import { CallbackHandler } from "../common/types";
import { findQuestionAnswerById } from "../common/utils";
import TelegramBot from "node-telegram-bot-api";
import { handleFrequentlyAskedQuestions } from "./serviceHandlers";

export const handleSelectQuestion: CallbackHandler = async ({
  bot,
  chatId,
  data,
}) => {
  const questionId = data.replace("select_question_", "");
  await handleQuestionSelection(bot, chatId, questionId);
};

export const handleQuestionSelection = async (
  bot: TelegramBot,
  chatId: number,
  questionId: string,
) => {
  const question = await findQuestionAnswerById(questionId);
  const keyboardOptions = [
    [
      {
        text: i18next.t("faqSection.backToQuestions"),
        callback_data: `back_to_questions`,
      },
    ],
  ];
  await bot.sendMessage(
    chatId,
    i18next.t("faqSection.selectedQuestion", {
      title: question.title,
    }),
  );
  await bot.sendMessage(chatId, question.answer, {
    reply_markup: {
      resize_keyboard: true,
      inline_keyboard: keyboardOptions,
    },
  });
};

export const backToQuestions: CallbackHandler = ({ bot, chatId }) => {
  handleFrequentlyAskedQuestions(bot, chatId);
};
