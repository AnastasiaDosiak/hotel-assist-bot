import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isValidName } from "../../common/validators";

export const lastNameStep = (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;
  if (!isValidName(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("bookingProcess.invalidLastName"));
  } else {
    session.bookingstage = "awaiting_phone_number";
    session.lastName = msg.text!;
    bot.sendMessage(chatId, i18next.t("bookingProcess.sharePhoneNumber"), {
      reply_markup: {
        keyboard: [
          [
            {
              text: i18next.t("bookingProcess.shareContact"),
              request_contact: true,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    });
  }
};
