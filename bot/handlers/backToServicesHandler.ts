import { CallbackHandler } from "../common/types";
import { handleExtraServices } from "./serviceHandlers";

export const backToServices: CallbackHandler = ({ bot, chatId }) => {
  handleExtraServices(bot, chatId);
};
