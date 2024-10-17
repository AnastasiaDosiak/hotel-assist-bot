import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { TRoomType } from "../common/types";

export const sendOrUpdateRoomTypeDetails = (
  bot: TelegramBot,
  chatId: number,
  messageId: number | null,
  indexOfRoom: number,
  rooms: TRoomType[],
) => {
  const roomType = rooms[indexOfRoom];
  const inlineKeyboard = [
    ...(indexOfRoom < rooms.length - 1
      ? [[{ text: "Next", callback_data: "next_room_type" }]]
      : []),
    [
      {
        text: i18next.t("bookingProcess.bookButton"),
        callback_data: `book_room_type_${roomType.type}`,
      },
    ],
  ];

  // Add "Back" button if it's not the first room
  if (indexOfRoom > 0) {
    inlineKeyboard.push([
      { text: "Back", callback_data: "previous_room_type" },
    ]);
  }

  const options = {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  };

  const caption = i18next.t("bookingProcess.roomDetails", {
    type: roomType.type,
    price: roomType.price,
    guests: roomType.guests,
  });

  if (messageId) {
    bot.editMessageMedia(
      {
        type: "photo",
        media: roomType.imageUrl,
        caption,
      },
      {
        chat_id: chatId,
        message_id: messageId,
        ...options,
      },
    );
  } else {
    bot.sendPhoto(chatId, roomType.imageUrl, {
      caption,
      ...options,
    });
  }
};
