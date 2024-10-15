import { CallbackHandler } from "../common/types";
import { handleProgramSelection } from "./extraServicesHandler";

// Handler for program selection
export const handleSelectProgram: CallbackHandler = ({ bot, chatId, data }) => {
  const programName = data.replace("select_program_", "");
  handleProgramSelection(bot, chatId, programName);
};
