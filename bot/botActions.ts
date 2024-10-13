import TelegramBot from "node-telegram-bot-api";
import i18next from "i18next";
import { TRoomType } from "./common/types";

export const sendOrUpdateRoomTypeDetails = (
  bot: TelegramBot,
  chatId: number,
  messageId: number | null,
  currentRoomTypeIndex: number,
  rooms: TRoomType[],
) => {
  const roomType = rooms[currentRoomTypeIndex];
  const inlineKeyboard = [
    ...(currentRoomTypeIndex < rooms.length - 1
      ? [[{ text: "Next", callback_data: "next_room_type" }]]
      : []),
    [
      {
        text: "Book this one",
        callback_data: `book_room_type_${roomType.type}`,
      },
    ],
  ];

  // Add "Back" button if it's not the first room
  if (currentRoomTypeIndex > 0) {
    inlineKeyboard.push([
      { text: "Back", callback_data: "previous_room_type" },
    ]);
  }

  const options = {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
  };

  const caption = i18next.t("roomDetails", {
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
