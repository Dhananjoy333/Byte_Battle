import { io } from "socket.io-client";

export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL ||"http://localhost:9000", {
  autoConnect: false,
});

export function connectSocket(): Promise<void> {
  if (socket.connected) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    };

    const onConnect = () => {
      cleanup();
      resolve();
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };

    socket.once("connect", onConnect);
    socket.once("connect_error", onError);

    socket.connect();

    // Handle the case where connection succeeds immediately.
    if (socket.connected) {
      cleanup();
      resolve();
    }
  });
}