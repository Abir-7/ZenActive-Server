import { io } from "../socket";

export const handleNewSubscription = (data: string) => {
  io.emit("new-subscription", {
    content: {
      message: data,
      time: new Date(Date.now()),
    },
  });
};
