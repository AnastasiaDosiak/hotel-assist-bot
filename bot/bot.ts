import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv";
import { roomTypes } from "../backend/common/constants";

dotenv.config();

const token: string = process.env.TELEGRAM_TOKEN as string;

const bot: TelegramBot = new TelegramBot(token, { polling: true });

let currentRoomTypeIndex = 0;
const userSessions: {
  [chatId: number]: { bookingStage?: string; checkInDate?: string };
} = {};

// Room setup
const rooms = roomTypes.map((room) => {
  return {
    type: room.type,
    imageUrl: room.imageUrl,
    price: room.price,
    guests: `${room.minGuests} - ${room.maxGuests}`,
  };
});

// Validate date format and that it's not today or in the past
const isValidDate = (dateString: string) => {
  const dateParts = dateString.split(".");

  if (dateParts.length !== 3) return false;

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed in JS Date
  const year = parseInt(dateParts[2], 10);

  const parsedDate = new Date(year, month, day);
  const today = new Date();

  if (
    parsedDate.getDate() !== day ||
    parsedDate.getMonth() !== month ||
    parsedDate.getFullYear() !== year
  ) {
    return false; // Invalid date
  }

  return parsedDate > today; // Ensure date is in the future
};

// Check if the checkout date is after the check-in date
const isCheckoutDateValid = (checkInDate: string, checkoutDate: string) => {
  const [checkInDay, checkInMonth, checkInYear] = checkInDate.split(".");
  const checkIn = new Date(
    parseInt(checkInYear, 10),
    parseInt(checkInMonth, 10) - 1,
    parseInt(checkInDay, 10),
  );

  const [checkOutDay, checkOutMonth, checkOutYear] = checkoutDate.split(".");
  const checkOut = new Date(
    parseInt(checkOutYear, 10),
    parseInt(checkOutMonth, 10) - 1,
    parseInt(checkOutDay, 10),
  );

  return checkOut > checkIn;
};

// Function to send or update room details
const sendOrUpdateRoomTypeDetails = (
  chatId: number,
  messageId: number | null,
  roomType: { type: string; imageUrl: string; price: number; guests: string },
) => {
  const inlineKeyboard = [
    // Only show "Next" if it's not the last room
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

  // If messageId is present, we edit the message instead of sending a new one
  if (messageId) {
    bot.editMessageMedia(
      {
        type: "photo",
        media: roomType.imageUrl,
        caption: `Room Type: ${roomType.type}. Price: ${roomType.price} UAH. Guests: ${roomType.guests}`,
      },
      {
        chat_id: chatId,
        message_id: messageId,
        ...options,
      },
    );
  } else {
    // Send a new message if no messageId is passed
    bot.sendPhoto(chatId, roomType.imageUrl, {
      caption: `Room Type: ${roomType.type}. Price: ${roomType.price} UAH. Guests: ${roomType.guests}`,
      ...options,
    });
  }
};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  currentRoomTypeIndex = 0;

  const options = {
    reply_markup: {
      keyboard: [
        [{ text: "Book a room" }],
        [{ text: "Information about LNUP services" }],
        [{ text: "Client support 24/7" }],
        [{ text: "Registration of additional services" }],
        [{ text: "Messages and reminders" }],
        [{ text: "Feedback and evaluations" }],
        [{ text: "Help for the city" }],
        [{ text: "Quick check-in/check-out" }],
      ],
      resize_keyboard: true,
      one_time_keyboard: false,
    },
  };

  bot.sendMessage(
    chatId,
    "Hello! I'm HotelAssist bot for Edem Resort Medical & SPA. How can I help you?",
    options,
  );
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const session = userSessions[chatId];

  if (!session?.bookingStage) {
    // If there's no ongoing booking process
    if (msg.text === "Book a room") {
      sendOrUpdateRoomTypeDetails(chatId, null, rooms[currentRoomTypeIndex]);
    }
  } else if (session.bookingStage === "awaiting_checkin_date") {
    // Validate check-in date
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(chatId, "The date is in the past. Please, try again.");
    } else {
      userSessions[chatId].checkInDate = msg.text!;
      userSessions[chatId].bookingStage = "awaiting_checkout_date";
      bot.sendMessage(
        chatId,
        "Please, write a checkout date. The format should be dd.mm.yyyy.",
      );
    }
  } else if (session.bookingStage === "awaiting_checkout_date") {
    // Validate check-out date
    if (!isValidDate(msg.text!)) {
      bot.sendMessage(
        chatId,
        "The format is incorrect or the date is in the past. Please, try again.",
      );
    } else if (
      !isCheckoutDateValid(userSessions[chatId].checkInDate!, msg.text!)
    ) {
      bot.sendMessage(
        chatId,
        "The checkout date cannot be earlier than the check-in date. Please, try again.",
      );
    } else {
      // Proceed with booking and clear session
      bot.sendMessage(
        chatId,
        `Your booking is from ${session.checkInDate} to ${msg.text}. We will process your booking shortly.`,
      );
      delete userSessions[chatId]; // Clear the session after successful booking
    }
  }
});

bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message!;
  const data = callbackQuery.data!;
  const chatId = message.chat.id;

  if (data === "next_room_type") {
    currentRoomTypeIndex = (currentRoomTypeIndex + 1) % rooms.length;
    sendOrUpdateRoomTypeDetails(
      message.chat.id,
      message.message_id,
      rooms[currentRoomTypeIndex],
    );
  } else if (data === "previous_room_type") {
    if (currentRoomTypeIndex > 0) {
      currentRoomTypeIndex--;
    }
    sendOrUpdateRoomTypeDetails(
      message.chat.id,
      message.message_id,
      rooms[currentRoomTypeIndex],
    );
  } else if (data.startsWith("book_room_type_")) {
    // Start the booking process
    userSessions[chatId] = { bookingStage: "awaiting_checkin_date" };
    bot.sendMessage(
      chatId,
      "Write a check-in date. The format should be dd.mm.yyyy",
    );
  }

  bot.answerCallbackQuery(callbackQuery.id);
});
