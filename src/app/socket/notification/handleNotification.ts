import { io } from "../socket";

export const handleNotification = (message: string, receiverId: string) => {
  io.emit(`notification-${receiverId}`, {
    message,
  });
};
