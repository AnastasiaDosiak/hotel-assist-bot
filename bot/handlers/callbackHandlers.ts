import { CallbackHandlersMap } from "../common/types";
import { handleSelectProgram } from "./programHandlers";
import {
  handleBookOption,
  handleBookRoom,
  handleContinueReservation,
  handleContinueReservationOption,
} from "./bookingHandlers";
import { handleSeeOtherRooms } from "./roomHandlers";
import { handleSelectService } from "./serviceHandlers";
import { handleSelectOption } from "./optionHandler";
import { backToServices } from "./backToServicesHandler";

// Mapping handlers based on specific prefixes
const callbackHandlers: CallbackHandlersMap = {
  select_service_: handleSelectService,
  book_room_type_: handleBookRoom,
  continue_reservation_: handleContinueReservation,
  continue_reserve_option_: handleContinueReservationOption,
  see_other_rooms: handleSeeOtherRooms,
  select_program_: handleSelectProgram,
  select_option_: handleSelectOption,
  back_to_services: backToServices,
  book_option_: handleBookOption,
};

export default callbackHandlers;
