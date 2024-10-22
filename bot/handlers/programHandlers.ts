import i18next from "i18next";
import TelegramBot from "node-telegram-bot-api";
import { CallbackHandler, TSessionData, TUserSession } from "../common/types";
import { createKeyboardOptions, getProgramOptions } from "../common/utils";

// Handler for program selection
export const handleSelectProgram: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  const programName = data.replace("select_program_", "");
  handleProgramSelection(bot, chatId, programName, userSessions);
};

export const handleProgramSelection = async (
  bot: TelegramBot,
  chatId: number,
  programName: string,
  userSessions: TUserSession,
) => {
  userSessions[chatId] = {
    ...userSessions[chatId],
    programName,
  } as TSessionData;
  const programWithOptions = await getProgramOptions(programName);

  if (programWithOptions) {
    const keyboardOptions = createKeyboardOptions(
      programWithOptions,
      "select_option_",
      "name",
    );

    bot.sendMessage(
      chatId,
      i18next.t("extraServices.selectOption", { programName }),
      {
        reply_markup: {
          resize_keyboard: true,
          inline_keyboard: keyboardOptions,
        },
      },
    );
  }
};
