import i18next from "i18next";
import { CommonStepParams } from "../../common/types";
import { isSpaService, isValidDate } from "../../common/utils";
import { checkSpaOptionAvailabilityStep } from "../extraServices/checkSpaOptionAvailabilityStep";
import { checkClinicAvailabilityStep } from "../extraServices/checkClinicAvailabilityStep";
// import { checkLaundryOptionAvailabilityStep } from "../extraServices/checkLaundryOptionAvailabilityStep";

export const servicesCheckinStep = async (props: CommonStepParams) => {
  const { msg, bot, session } = props;
  const { serviceName, programName, option } = session;
  const chatId = msg.chat.id;

  if (!isValidDate(msg.text!)) {
    bot.sendMessage(chatId, i18next.t("invalidDateFormat"));
  } else {
    session.checkInDate = msg.text!;
    if (isSpaService(serviceName)) {
      await checkSpaOptionAvailabilityStep(
        serviceName,
        msg.text!,
        programName,
        session.checkInDate,
        option,
        bot,
        chatId,
        session,
      );
    } else if (serviceName === i18next.t("extraServices.edemClinic")) {
      await checkClinicAvailabilityStep(
        option,
        msg.text!,
        session,
        serviceName,
        bot,
        chatId,
      );
    }
    // else if (serviceName === i18next.t("extraServices.laundry")) {
    //   await checkLaundryOptionAvailabilityStep(
    //     option,
    //     msg.text!,
    //     session,
    //     serviceName,
    //     bot,
    //     chatId,
    //   );
    // }
  }
};
