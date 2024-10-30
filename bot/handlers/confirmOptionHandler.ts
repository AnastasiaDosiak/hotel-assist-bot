import i18next from "i18next";
import { CommonStepParams } from "../common/types";
import {
  isExtraCleaningService,
  isLaundryService,
  isRestaurantBooking,
  isSpaService,
} from "../common/utils";
import { gatherBookingData } from "../services/bookingService";
import { bookProgramOptionStep } from "./extraServices/bookProgramOptionStep";
import { bookSpaProgramOptionStep } from "./extraServices/bookSpaProgramOptionStep";
import { bookLaundryStep } from "./extraServices/bookLaundryStep";
import { bookExtraCleaningStep } from "./extraServices/bookExtraCleaningStep";
import { bookRestaurantTableStep } from "./extraServices/bookRestaurantTableStep";

export const confirmOptionStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const chatId = msg.chat.id;

  const { serviceName } = session;

  if (serviceName) {
    const bookingData = gatherBookingData(chatId, session);

    if (isSpaService(serviceName)) {
      bookSpaProgramOptionStep(bot, chatId, session, bookingData);
    } else if (isLaundryService(serviceName)) {
      bookLaundryStep(bot, chatId, session);
    } else if (isExtraCleaningService(serviceName)) {
      bookExtraCleaningStep(bot, chatId, session);
    } else if (isRestaurantBooking(serviceName)) {
      bookRestaurantTableStep(bot, chatId, session);
    } else {
      bookProgramOptionStep(bot, chatId, session, bookingData);
    }
  } else {
    bot.sendMessage(chatId, i18next.t("extraServices.noOptionsAvailable"));
    console.error("No available options found in session");
  }
};
