import TelegramBot from "node-telegram-bot-api";
import { TRoomType, TSessionData, TUserSession } from "../../common/types";
import { setupStep } from "./setupStep";
import { checkInStep } from "./checkInStep";
import { checkoutWaitingStep } from "./checkoutWaitingStep";
import { firstNameStep } from "./firstNameStep";
import { lastNameStep } from "./lastNameStep";
import { confirmStep } from "./confirmStep";

export const handleTextMessage = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  userSessions: TUserSession,
  rooms: TRoomType[],
  setCurrentRoomIndex: (index: number) => number,
) => {
  const chatId = msg.chat.id;
  const session = userSessions[chatId] as TSessionData;
  const commonStepParams = {
    msg,
    bot,
    rooms,
    session,
    setCurrentRoomIndex,
  };
  setupStep(commonStepParams);

  if (session && session.bookingstage) {
    if (session.bookingstage === "awaiting_checkin_date") {
      checkInStep(commonStepParams);
    } else if (session.bookingstage === "awaiting_checkout_date") {
      checkoutWaitingStep(commonStepParams);
    } else if (session.bookingstage === "awaiting_first_name") {
      firstNameStep(commonStepParams);
    } else if (session.bookingstage === "awaiting_last_name") {
      lastNameStep(commonStepParams);
    } else if (session.bookingstage === "check_availability") {
      confirmStep(commonStepParams);
    }
  }
};
