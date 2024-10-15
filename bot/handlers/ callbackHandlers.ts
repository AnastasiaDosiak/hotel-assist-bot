import { CallbackHandlersMap } from "../common/types";
import { handleSelectProgram } from "./programHandlers";
import { handleBookRoom, handleContinueReservation } from "./bookingHandlers";
import { handleSeeOtherRooms } from "./roomHandlers";
import { handleSelectService } from "./  serviceHandlers";

// Mapping handlers based on specific prefixes
const callbackHandlers: CallbackHandlersMap = {
  select_service_: handleSelectService,
  select_program_: handleSelectProgram,
  book_room_type_: handleBookRoom,
  continue_reservation_: handleContinueReservation,
  see_other_rooms: handleSeeOtherRooms,
};

export default callbackHandlers;
