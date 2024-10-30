import { CallbackHandlersMap } from "../common/types";
import { handleSelectSpaProgram } from "./programHandlers";
import {
  handleBookSpaOption,
  handleBookRoom,
  handleContinueReservation,
  handleContinueReservationOption,
  handleBookOption,
} from "./bookingHandlers";
import { handleSeeOtherRooms } from "./roomHandlers";
import { handleSelectService } from "./serviceHandlers";
import { handleSelectOption, handleSelectSpaOption } from "./optionHandler";
import { backToServices } from "./backToServicesHandler";
import { backToQuestions, handleSelectQuestion } from "./faqSectionHandlers";
import {
  handleEnterFirstAndLastName,
  handleLeaveFeedback,
  handleRatedHotel,
  handleRateHotel,
  handleSeeLatestFeedbacks,
} from "./feedbackHandler";

// Mapping handlers based on specific prefixes
const callbackHandlers: CallbackHandlersMap = {
  select_service_: handleSelectService,
  book_room_type_: handleBookRoom,
  continue_reservation_: handleContinueReservation,
  continue_reserve_option_: handleContinueReservationOption,
  see_other_rooms: handleSeeOtherRooms,
  select_spa_program_: handleSelectSpaProgram,
  select_spa_option_: handleSelectSpaOption,
  back_to_services: backToServices,
  back_to_questions: backToQuestions,
  book_spa_option_: handleBookSpaOption,
  select_option_: handleSelectOption,
  book_option_: handleBookOption,
  select_question: handleSelectQuestion,
  leave_feedback: handleLeaveFeedback,
  see_latest_feedbacks: handleSeeLatestFeedbacks,
  skip_first_and_last_name: handleRateHotel,
  enter_first_and_last_name: handleEnterFirstAndLastName,
  rated_: handleRatedHotel,
};

export default callbackHandlers;
