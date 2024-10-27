import i18next from "i18next";
import { CommonStepParams } from "../../common/types";

export const servicesBookedRoomNumberStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  session.roomNumber = Number(msg.text!);
  await bot.sendMessage(chatId, i18next.t("extraServices.shareContactNumber"));
  session.serviceBookingStage = "awaiting_booked_room_contact";
};
