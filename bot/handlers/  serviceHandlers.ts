import { CallbackHandler } from "../common/types";
import { handleServiceCategory } from "./extraServicesHandler";

// Handler for service selection
export const handleSelectService: CallbackHandler = ({ bot, chatId, data }) => {
  const serviceName = data.replace("select_service_", "");
  handleServiceCategory(bot, chatId, serviceName);
};
