import i18next from "i18next";
import TelegramBot from "node-telegram-bot-api";
import { ExtraService } from "../../backend/models/ExtraService";
import { CallbackHandler } from "../common/types";
import { createKeyboardOptions } from "../common/utils";

// Handler for service selection
export const handleSelectService: CallbackHandler = ({ bot, chatId, data }) => {
  const serviceName = data.replace("select_service_", "");
  handleServiceCategory(bot, chatId, serviceName);
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
) => {
  const service = await ExtraService.findOne({ where: { serviceName } });
  if (service) {
    const categories = service.programs.map((program) => [
      {
        text: program.programName,
        callback_data: `select_program_${program.programName}`,
      },
    ]);
    bot.sendMessage(
      chatId,
      i18next.t("extraServices.selectCategory", { serviceName }),
      {
        reply_markup: {
          resize_keyboard: true,
          inline_keyboard: categories,
        },
      },
    );
  }
};
