import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { pack } from "msgpackr";
import type { ClientMsg, ClientMsgNoRequestId } from "#/types/Backend";
import type { ConnectionStatus } from "#/types/StringLiterals";

type PoopStoreState = {
  /** WebSocket connection status */
  connectionStatus: ConnectionStatus;
};

type PoopStoreHelpers = {
  /** Initialize the socket pointing to a specific ws: url. */
  initSocket: (wsUrl?: string) => void;
  /** Close the socket when the project unmounts. */
  closeSocket: () => void;
  /** Send a client message to the server. */
  sendMessage: (msg: ClientMsgNoRequestId) => void;
};

const PoopStoreContext = createContext<
  (PoopStoreState & PoopStoreHelpers) | null
>(null);

export function usePoopStore() {
  const currentContext = useContext(PoopStoreContext);
  if (!currentContext) {
    throw new Error(
      "Don't use this hook unless nested within the Project Context Provider component you dumbass.",
    );
  }

  return currentContext;
}

type Props = {
  children: React.ReactNode;
};
export function PoopStoreContextProvider({ children }: Props) {
  /** Ref to the web socket used in this project. */
  const socket = useRef<WebSocket | null>(null);
  /** Client message id accumulator - should be unique for each request sent from the client. */
  const nextMsgId = useRef(0);

  /** WebSocket connection status. */
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>("INIT");

  /** Initialize the socket pointing to a specific ws: url. */
  const initSocket = useCallback((wsUrl: string = "ws://localhost:8080/ws") => {
    socket.current = new WebSocket(wsUrl);
    socket.current.binaryType = "arraybuffer";
    socket.current.onopen = () => setConnectionStatus("CONNECTED");
    socket.current.onerror = () => setConnectionStatus("FAILED");

    // socket.current.onmessage <-- Do this way! :=)
  }, []);

  /** Close the socket when the project unmounts. */
  const closeSocket = useCallback(() => {
    socket.current?.close();
  }, []);

  /** Send a client message to the server. */
  const sendMessage = useCallback(
    (msg: ClientMsgNoRequestId) => {
      if (connectionStatus === "CONNECTED") {
        if (!socket.current) {
          throw new Error(
            "Connection status somehow set to 'CONNECTED' without the socket connecting to the server.",
          );
        }

        // Attach the next message id
        const fullMsg: ClientMsg = {
          ...msg,
          requestId: nextMsgId.current,
        };

        socket.current.send(pack(fullMsg));
        nextMsgId.current += 1;
      }
    },
    [connectionStatus],
  );

  return (
    <PoopStoreContext.Provider
      value={{
        connectionStatus,
        initSocket,
        closeSocket,
        sendMessage,
      }}
    >
      {children}
    </PoopStoreContext.Provider>
  );
}
