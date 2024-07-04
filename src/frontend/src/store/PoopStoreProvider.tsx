import { createContext, useCallback, useRef, useReducer } from "react";
import { poopStoreReducer } from "./reducer";
import { unpack, pack } from "msgpackr";
import type {
  ClientMsg,
  ClientMsgNoRequestId,
  ServerMsg,
} from "#/types/Backend";
import type {
  PoopStoreState,
  PoopStoreActions,
  PoopStoreHelpers,
} from "./types";

export const PoopStoreContext = createContext<
  | (PoopStoreState &
      PoopStoreHelpers & { dispatch: React.Dispatch<PoopStoreActions> })
  | null
>(null);

type Props = {
  children: React.ReactNode;
};
export function PoopStoreContextProvider({ children }: Props) {
  /** Ref to the web socket used in this project. */
  const socket = useRef<WebSocket | null>(null);

  const nextMsgId = useRef<number>(0);

  /** Poop store reducer state and dispatch. */
  const [state, dispatch] = useReducer(poopStoreReducer, {
    socketConnStatus: "INIT",
    currentView: "playlists",
    playlists: [],
    channels: [],
    videos: [],
  });

  /** Message handler for messages received from the backend. */
  const messageHandler = useCallback((event: MessageEvent) => {
    const serverMsg: ServerMsg = unpack(event.data);

    if (serverMsg.error) {
      console.error(
        `Backend return an error for type - ${serverMsg.what} - ${serverMsg.error}`,
      );
      return;
    }

    console.log(serverMsg);

    switch (serverMsg.what) {
      case "PLAYLIST_INFO_UPDATE": {
        dispatch({
          type: "set-playlists",
          payload: serverMsg.data,
        });
        break;
      }
      case "CHANNEL_INFO_UPDATE": {
        dispatch({
          type: "set-channels",
          payload: serverMsg.data,
        });
        break;
      }
      case "VIDEO_INFO_UPDATE": {
        dispatch({
          type: "set-videos",
          payload: serverMsg.data,
        });
        break;
      }
    }
  }, []);

  /** Initialize the socket pointing to a specific ws: url. */
  const initSocket = useCallback(
    (wsUrl: string) => {
      dispatch({
        type: "set-connection-status",
        payload: "INIT",
      });

      socket.current = new WebSocket(wsUrl);
      socket.current.binaryType = "arraybuffer";

      socket.current.onopen = () => {
        dispatch({
          type: "set-connection-status",
          payload: "CONNECTED",
        });
      };
      socket.current.onerror = () => {
        dispatch({
          type: "set-connection-status",
          payload: "FAILED",
        });
      };
      socket.current.onclose = () => {
        dispatch({
          type: "set-connection-status",
          payload: "CLOSED",
        });
      };
      socket.current.onmessage = messageHandler;
    },
    [messageHandler],
  );

  /** Close the socket when the project unmounts. */
  const closeSocket = useCallback(() => {
    socket.current?.close();
  }, []);

  /**
   * Send a client message to the server.
   *
   * @returns True if the message was sent successfully.
   */
  const sendMessage = useCallback(
    (msg: ClientMsgNoRequestId) => {
      if (state.socketConnStatus === "CONNECTED") {
        if (!socket.current || !socket.current.OPEN) {
          console.error(
            "Somehow socket status is set to CONNECTED without the socket being OPEN.",
          );
          return false;
        }

        // Attach the next message id
        const fullMsg: ClientMsg = {
          ...msg,
          requestId: nextMsgId.current,
        };
        nextMsgId.current++;

        // Send the message to the backend.
        socket.current.send(pack(fullMsg));
        return true;
      } else {
        return false;
      }
    },
    [state.socketConnStatus],
  );

  return (
    <PoopStoreContext.Provider
      value={{
        ...state,
        dispatch,
        initSocket,
        closeSocket,
        sendMessage,
      }}
    >
      {children}
    </PoopStoreContext.Provider>
  );
}
