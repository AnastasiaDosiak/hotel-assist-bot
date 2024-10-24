import i18next from "i18next";
import TelegramBot from "node-telegram-bot-api";
import { ExtraService } from "../../backend/models/ExtraService";
import { CallbackHandler, TSessionData, TUserSession } from "../common/types";
import { createKeyboardOptions, isSpaService } from "../common/utils";

// Handler for service selection
export const handleSelectService: CallbackHandler = ({
  bot,
  chatId,
  data,
  userSessions,
}) => {
  const serviceName = data.replace("select_service_", "");
  handleServiceCategory(bot, chatId, serviceName, userSessions);
};

export const handleExtraServices = async (bot: TelegramBot, chatId: number) => {
  const services = await ExtraService.findAll();
  const serviceOptions = createKeyboardOptions(
    services,
    "select_service_",
    "serviceName",
  );

  bot.sendMessage(chatId, i18next.t("extraServices.selectService"), {
    reply_markup: {
      resize_keyboard: true,
      inline_keyboard: serviceOptions,
    },
  });
};

export const handleServiceCategory = async (
  bot: TelegramBot,
  chatId: number,
  serviceName: string,
  userSessions: TUserSession,
) => {
  const service = await ExtraService.findOne({ where: { serviceName } });
  userSessions[chatId] = {
    ...userSessions[chatId],
    serviceName,
  } as TSessionData;

  if (service && serviceName) {
    let categories = [] as { text: string; callback_data: string }[][];
    if (isSpaService(serviceName)) {
      categories = service.programs.map((program) => [
        {
          text: program.programName,
          callback_data: `select_spa_program_${program.programName}`,
        },
      ]);
    } else {
      categories = service.programs.flatMap((program) =>
        program.options.map((option) => [
          {
            text: option.name,
            callback_data: `select_option_${option.name}`,
          },
        ]),
      );
    }

    if (isSpaService(serviceName)) {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.selectCategory", { serviceName }),
        {
          reply_markup: {
            resize_keyboard: true,
            inline_keyboard: categories,
          },
        },
      );
    } else {
      await bot.sendMessage(
        chatId,
        i18next.t("extraServices.selectOption", { serviceName }),
        {
          reply_markup: {
            resize_keyboard: true,
            inline_keyboard: categories,
          },
        },
      );
    }
  }
};
