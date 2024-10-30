import TelegramBot from "node-telegram-bot-api";

export type TRoomType = {
  type: string;
  imageUrl: string;
  price: number;
  guests: string;
};

export type TSessionData = {
  roomBookingStage: string;
  checkInDate: string;
  checkOutDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  roomType: string;
  availableRoomId: string;
  roomIndex: number;
  programName: string;
  serviceName: string;
  option: string;
  optionDuration: number;
  serviceBookingStage: string;
  roomNumber?: number;
  rating?: string;
  ratingStage?: string;
  fullName?: string;
  restaurantBookedTime?: string;
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
  endDate?: string | null;
  startTime?: string | null;
};

export type CallbackHandler = (props: {
  bot: TelegramBot;
  chatId: number;
  data: string;
  userSessions: TUserSession;
  message?: TelegramBot.Message;
  rooms?: TRoomType[];
  currentRoomIndex?: number;
}) => void;

export interface CallbackHandlersMap {
  [key: string]: CallbackHandler;
}

export interface CommandParams {
  bot: TelegramBot;
  userSessions: TUserSession;
  rooms: TRoomType[];
  currentRoomIndex: number;
  setCurrentRoomIndex: (index: number) => number;
}

export interface CommonStepParams {
  bot: TelegramBot;
  rooms?: TRoomType[];
  msg: TelegramBot.Message;
  session: TSessionData;
  setCurrentRoomIndex?: (index: number) => number;
}

export type OptionsType<T extends Record<string, any>> = T[];
