import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { ExtraService } from "../../backend/models/ExtraService";

export const handleExtraServices = async (bot: TelegramBot, chatId: number) => {
  const services = await ExtraService.findAll();

  const serviceOptions = services.map((service) => [
    {
      text: service.serviceName,
      callback_data: `select_service_${service.serviceName}`,
    },
  ]);

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

export const handleProgramSelection = async (
  bot: TelegramBot,
  chatId: number,
  programName: string,
) => {
  const service = await ExtraService.findOne({
    where: { "programs.programName": programName },
  });
  if (service) {
    const program = service.programs.find((p) => p.programName === programName);

    if (program) {
      // const description = `${program.description}\n\n${i18next.t("bookingProcess.goals")}:\n${program.goals.join("\n")}`;

      bot.sendMessage(chatId, programName, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: i18next.t("bookingProcess.bookNow"),
                callback_data: `book_program_${programName}`,
              },
            ],
          ],
        },
      });
    }
  }
};

export const handleProgramBooking = (
  bot: TelegramBot,
  chatId: number,
  programName: string,
) => {
  // Booking flow - ask for room number or non-resident booking
  bot
    .sendMessage(chatId, i18next.t("bookingProcess.enterRoomNumber"))
    .then((sentMessage) => {
      const messageId = sentMessage.message_id; // Capture the messageId for the reply

      bot.onReplyToMessage(chatId, messageId, (msg) => {
        const roomNumber = msg.text;

        // TODO: Check room availability and proceed with booking or handle independent booking

        bot.sendMessage(
          chatId,
          i18next.t("bookingProcess.bookingConfirmed", {
            programName,
            roomNumber,
          }),
        );
      });
    });
};
