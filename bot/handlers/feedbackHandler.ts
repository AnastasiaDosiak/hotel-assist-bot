import i18next from "i18next";
import { Feedback } from "../../backend/models/Feedback";
import { CallbackHandler, TSessionData } from "../common/types";
import { convertEstimationToStars } from "../common/utils";
import TelegramBot from "node-telegram-bot-api";

export const handleLeaveFeedback: CallbackHandler = async ({ bot, chatId }) => {
  const keyboardOptions = [
    [
      {
        text: i18next.t("feedbackSection.skip"),
        callback_data: `skip_first_and_last_name`,
      },
    ],
    [
      {
        text: i18next.t("feedbackSection.enter"),
        callback_data: `enter_first_and_last_name`,
      },
    ],
  ];
  await bot.sendMessage(
    chatId,
    i18next.t("feedbackSection.enterFirstAndLastName"),
    {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: keyboardOptions,
      },
    },
  );
};

export const handleSeeLatestFeedbacks: CallbackHandler = async ({
  bot,
  chatId,
}) => {
  try {
    await bot.sendMessage(
      chatId,
      i18next.t("feedbackSection.selectedActionLatestFeedbacks"),
    );
    const feedbacks = await Feedback.findAll({
      order: [["createdAt", "DESC"]],
      limit: 5,
    });

    // Iterate over feedbacks sequentially or in parallel with Promise.all if preferred
    for (const feedback of feedbacks) {
      const estimationStars = convertEstimationToStars(feedback.estimation);
      const user = feedback.fullName ? `${feedback.fullName}` : "Anonymous";
      await bot.sendMessage(
        chatId,
        `Feedback by ${user} \n\n${feedback.comment} \n\nEstimation: ${estimationStars}`,
      );
    }
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    await bot.sendMessage(
      chatId,
      i18next.t("feedbackSection.seeLatestFeedback"),
    );
  }
};

export const handleEnterFirstAndLastName: CallbackHandler = async ({
  chatId,
  bot,
  userSessions,
}) => {
  userSessions[chatId] = {
    ...userSessions[chatId],
    ratingStage: "awaiting_last_and_first_name",
  } as TSessionData;
  await bot.sendMessage(
    chatId,
    i18next.t("feedbackSection.enterFirstAndLastNameChosen"),
  );
};

export const handleRateHotel: CallbackHandler = async ({ bot, chatId }) => {
  await bot.sendMessage(chatId, i18next.t("feedbackSection.rateHotel"), {
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
};

export const handleRatedHotel: CallbackHandler = async ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  const rating = data.replace("rated_", "");
  userSessions[chatId] = {
    ...userSessions[chatId],
    rating,
    ratingStage: "awaiting_leave_comment",
  };

  await bot.sendMessage(chatId, i18next.t("feedbackSection.leaveComment"));
};

export const handleFeedbacks = async (bot: TelegramBot, chatId: number) => {
  const options = [
    [
      {
        text: i18next.t("feedbackSection.leaveFeedback"),
        callback_data: `leave_feedback`,
      },
    ],
    [
      {
        text: i18next.t("feedbackSection.seeLatestFeedbacks"),
        callback_data: `see_latest_feedbacks`,
      },
    ],
  ];

  await bot.sendMessage(chatId, i18next.t("feedbackSection.selectAction"), {
    reply_markup: {
      resize_keyboard: true,
      inline_keyboard: options,
    },
  });
};
