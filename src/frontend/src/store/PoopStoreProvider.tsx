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

  /** Poop store reducer state and dispatch. */
  const [state, dispatch] = useReducer(poopStoreReducer, {
    socketConnStatus: "INIT",
    nextMsgId: 0,
    playlists: [],
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
      }
    }
  }, []);

  /** Initialize the socket pointing to a specific ws: url. */
  const initSocket = useCallback(
    (wsUrl: string = "ws://localhost:8080/ws") => {
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
          payload: "INIT",
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
   * WARNING - Do not use this as a dependency in a useEffect.
   * This function depends on the state.nextMsgId value, and changes
   * the value in this function call. This enters an infinite loop
   * and your effect or callback will re-run every rendering frame.
   */
  const sendMessage = (msg: ClientMsgNoRequestId) => {
    if (socket.current && socket.current.OPEN) {
      // Attach the next message id
      const fullMsg: ClientMsg = {
        ...msg,
        requestId: state.nextMsgId,
      };
      dispatch({ type: "next-msg-id" });

      // Send the message to the backend.
      socket.current.send(pack(fullMsg));
    }
  };

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
