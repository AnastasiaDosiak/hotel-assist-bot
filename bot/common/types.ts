import TelegramBot from "node-telegram-bot-api";

export type TRoomType = {
  type: string;
  imageUrl: string;
  price: number;
  guests: string;
};

export type TSessionData = {
  bookingStage: string;
  checkInDate: string;
  checkOutDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  roomType: string;
  availableRoomId: string;
};

export type TUserSession = {
  [chatId: number]: TSessionData;
};

export type TUserBookingData = {
  userId: string;
  phone: string;
  firstName: string;
  lastName: string;
  startDate: string;
  endDate: string;
};

export type CallbackHandler = (props: {
  bot: TelegramBot;
  chatId: number;
  data: string;
  userSessions?: TUserSession;
  message?: TelegramBot.Message;
  rooms?: TRoomType[];
  currentRoomTypeIndex?: number;
}) => void;

export interface CallbackHandlersMap {
  [key: string]: CallbackHandler;
}
