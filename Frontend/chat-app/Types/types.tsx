export interface User {
  _id: string;
  email: string;
  username: string;
}

export interface MessageType {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export interface SelectedUserType {
  _id: string;
  username: string;
}
