import type { ConnectionStatus, ClientMsgNoRequestId } from "#/types/Backend";
import type { Playlist } from "#/types/DataTypes";

export type PoopStoreState = {
  socketConnStatus: ConnectionStatus;
  nextMsgId: number;
  playlists: Playlist[];
};

export type PoopStoreActions =
  | {
      type: "set-connection-status";
      payload: ConnectionStatus;
    }
  | {
      type: "next-msg-id";
    }
  | {
      type: "set-playlists";
      payload: Playlist[];
    };

export type PoopStoreHelpers = {
  /** Initialize the socket pointing to a specific ws: url. */
  initSocket: (wsUrl?: string) => void;
  /** Close the socket when the project unmounts. */
  closeSocket: () => void;
  /** Send a client message to the server. */
  sendMessage: (msg: ClientMsgNoRequestId) => void;
};
