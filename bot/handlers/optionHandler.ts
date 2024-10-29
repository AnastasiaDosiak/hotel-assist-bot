import TelegramBot from "node-telegram-bot-api";
import { CallbackHandler, TUserSession } from "../common/types";
import { findOptionByName, getSpaOptionDetails } from "../common/utils";
import i18next from "i18next";

export const handleSelectSpaOption: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  const optionName = data.replace("select_spa_option_", "");
  handleSpaOptionSelection(bot, chatId, optionName, userSessions);
};

export const handleSpaOptionSelection = async (
  bot: TelegramBot,
  chatId: number,
  optionName: string,
  userSessions: TUserSession,
) => {
  const session = userSessions[chatId];
  const programName = session.programName;
  session.option = optionName;
  const optionDetails = await getSpaOptionDetails(programName, optionName);
  const keyboardOptions = [
    [
      {
        text: i18next.t("extraServices.bookThisOption"),
        callback_data: `book_spa_option_${optionName}`,
      },
    ],
    [
      {
        text: i18next.t("extraServices.backToServices"),
        callback_data: `back_to_services`,
      },
    ],
  ];

  await bot.sendPhoto(chatId, optionDetails?.imageUrl as string);
  await bot.sendMessage(
    chatId,
    `${optionDetails?.description}\n\nPrice: ${optionDetails?.price}`, // Send the description and price
    {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: keyboardOptions,
      },
    },
  );
};

export const handleSelectOption: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  const optionName = data.replace("select_option_", "");
  handleOptionSelection(bot, chatId, optionName, userSessions);
};

export const handleOptionSelection = async (
  bot: TelegramBot,
  chatId: number,
  optionName: string,
  userSessions: TUserSession,
) => {
  const session = userSessions[chatId];
  session.option = optionName;
  const optionDetails = await findOptionByName(optionName);
  const keyboardOptions = [
    [
      {
        text: i18next.t("extraServices.backToServices"),
        callback_data: `back_to_services`,
      },
    ],
  ];

  // for golf we show only info
  if (session.serviceName !== i18next.t("extraServices.golfClub")) {
    keyboardOptions.unshift([
      {
        text: i18next.t("extraServices.bookThisOption"),
        callback_data: `book_option_${optionName}`,
      },
    ]);
  }

  await bot.sendMessage(
    chatId,
    i18next.t("extraServices.selectedOption", { optionName }),
  );

  if (
    session.serviceName !== i18next.t("extraServices.laundry") &&
    session.serviceName !== i18next.t("extraServices.extraCleaning")
  ) {
    await bot.sendPhoto(chatId, optionDetails?.imageUrl as string);
  }

  if (
    session.serviceName === i18next.t("extraServices.golfClub") ||
    session.serviceName === i18next.t("extraServices.restaurants")
  ) {
    await bot.sendMessage(chatId, `${optionDetails?.description}`, {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: keyboardOptions,
      },
    });
  } else {
    await bot.sendMessage(
      chatId,
      `${optionDetails?.description}\n\nPrice: ${optionDetails?.price}`,
      {
        reply_markup: {
          resize_keyboard: true,
          inline_keyboard: keyboardOptions,
        },
      },
    );
  }
};
