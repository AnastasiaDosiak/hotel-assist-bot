import TelegramBot from "node-telegram-bot-api";
import { TRoomType, TUserSession } from "../../common/types";
import { setupStep } from "./setupStep";
import { checkInStep } from "./checkInStep";
import { checkoutWaitingStep } from "./checkoutWaitingStep";
import { firstNameStep } from "./firstNameStep";
import { lastNameStep } from "./lastNameStep";
import { confirmStep } from "./confirmStep";
import { servicesCheckinStep } from "./servicesCheckinStep";
import { confirmOptionStep } from "../confirmOptionHandler";
import { servicesBookedRoomContactStep } from "./servicesBookedRoomContactStep";
import { servicesBookedRoomNumberStep } from "./servicesBookedRoomNumberStep";
import { servicesBookedCheckInStep } from "./servicesBookedCheckInDate";
import { enterFirstAndLastNameStep } from "./enterFirstAndLastNameStep";
import { leaveCommentStep } from "./leaveCommentStep";

export const handleTextMessage = (
  bot: TelegramBot,
  msg: TelegramBot.Message,
  userSessions: TUserSession,
  rooms: TRoomType[],
  setCurrentRoomIndex: (index: number) => number,
) => {
  const chatId = msg.chat.id;
  const session = userSessions[chatId];
  const commonStepParams = {
    msg,
    bot,
    rooms,
    session,
    setCurrentRoomIndex,
  };
  setupStep(commonStepParams);

  if (session) {
    if (session.roomBookingStage) {
      if (session.roomBookingStage === "awaiting_checkin_date") {
        checkInStep(commonStepParams);
      } else if (session.roomBookingStage === "awaiting_checkout_date") {
        checkoutWaitingStep(commonStepParams);
      } else if (session.roomBookingStage === "awaiting_first_name") {
        firstNameStep(commonStepParams, "roomBookingStage");
      } else if (session.roomBookingStage === "awaiting_last_name") {
        lastNameStep(commonStepParams, "roomBookingStage");
      } else if (session.roomBookingStage === "confirm_step") {
        confirmStep(commonStepParams);
      }
    }
    if (session.serviceBookingStage) {
      if (session.serviceBookingStage === "awaiting_booked_room_number") {
        servicesBookedRoomNumberStep(commonStepParams);
      } else if (
        session.serviceBookingStage === "awaiting_booked_room_contact"
      ) {
        servicesBookedRoomContactStep(commonStepParams);
      } else if (
        session.serviceBookingStage === "awaiting_booked_checkin_date"
      ) {
        servicesBookedCheckInStep(commonStepParams);
      } else if (session.serviceBookingStage === "awaiting_checkin_date") {
        servicesCheckinStep(commonStepParams);
      } else if (session.serviceBookingStage === "awaiting_first_name") {
        firstNameStep(commonStepParams, "serviceBookingStage");
      } else if (session.serviceBookingStage === "awaiting_last_name") {
        lastNameStep(commonStepParams, "serviceBookingStage");
      } else if (session.serviceBookingStage === "confirm_step") {
        confirmOptionStep(commonStepParams);
      }
    }
    if (session.ratingStage) {
      if (session.ratingStage === "awaiting_last_and_first_name") {
        enterFirstAndLastNameStep(commonStepParams);
      } else if (session.ratingStage === "awaiting_leave_comment") {
        leaveCommentStep(commonStepParams);
      }
    }
  }
};
