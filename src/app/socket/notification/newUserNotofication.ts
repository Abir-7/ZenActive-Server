import { io } from "../socket";

export const handleNewUser = () => {
  console.log();

  io.emit("new-user", {
    content: {
      message: `New User registered.`,
      time: new Date(Date.now()),
    },
  });
};
