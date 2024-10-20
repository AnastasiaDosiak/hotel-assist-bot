import { CallbackHandlersMap } from "../common/types";
import { handleSelectProgram } from "./programHandlers";
import { handleBookRoom, handleContinueReservation } from "./bookingHandlers";
import { handleSeeOtherRooms } from "./roomHandlers";
import { handleSelectService } from "./serviceHandlers";
import { handleSelectOption } from "./optionHandler";
import { backToServices } from "./backToServicesHandler";

// Mapping handlers based on specific prefixes
const callbackHandlers: CallbackHandlersMap = {
  select_service_: handleSelectService,
  book_room_type_: handleBookRoom,
  continue_reservation_: handleContinueReservation,
  see_other_rooms: handleSeeOtherRooms,
  select_program_: handleSelectProgram,
  select_option_: handleSelectOption,
  back_to_services: backToServices,
};

export default callbackHandlers;
