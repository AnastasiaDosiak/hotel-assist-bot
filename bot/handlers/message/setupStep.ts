import i18next from "i18next";
import { sendOrUpdateRoomTypeDetails } from "../../services/roomService";
import { CommonStepParams } from "../../common/types";
import {
  handleExtraServices,
  handleFrequentlyAskedQuestions,
} from "../serviceHandlers";

export const setupStep = (props: CommonStepParams) => {
  const { msg, bot, rooms, session, setCurrentRoomIndex } = props;
  const chatId = msg.chat.id;

  if (!session?.roomBookingStage && setCurrentRoomIndex && rooms) {
    if (msg.text === i18next.t("bookRoom")) {
      setCurrentRoomIndex(0);
      sendOrUpdateRoomTypeDetails(bot, chatId, null, 0, rooms);
    }
    if (msg.text === i18next.t("additionalServices")) {
      handleExtraServices(bot, chatId);
    }
    if (msg.text === i18next.t("additionalServices")) {
      handleExtraServices(bot, chatId);
    }
    if (msg.text === i18next.t("faq")) {
      handleFrequentlyAskedQuestions(bot, chatId);
    }
  }
};
