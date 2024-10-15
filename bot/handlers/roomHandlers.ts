import { sendOrUpdateRoomTypeDetails } from "../services/roomService";
import { CallbackHandler, TRoomType } from "../common/types";

// Handler for viewing other rooms
export const handleSeeOtherRooms: CallbackHandler = ({
  bot,
  chatId,
  rooms,
}) => {
  if (rooms) {
    sendOrUpdateRoomTypeDetails(bot, chatId, null, 0, rooms as TRoomType[]);
  }
};
