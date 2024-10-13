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
};

export type TUserSessions = {
  [chatId: number]: TSessionData;
};
