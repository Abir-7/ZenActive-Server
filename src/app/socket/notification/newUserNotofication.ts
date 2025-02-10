import { io } from "../socket";

export const handleNewUser = () => {
  io.emit("new-user", {
    content: {
      message: `New User registered.`,
      time: new Date(Date.now()),
    },
  });
};
