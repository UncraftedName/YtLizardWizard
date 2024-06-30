import type { ConnectionStatus, ClientMsgNoRequestId } from "#/types/Backend";
import type { Playlist, Channel, Video } from "#/types/DataTypes";
import type { PageView } from "#/types/Routing";

export type PoopStoreState = {
  socketConnStatus: ConnectionStatus;
  nextMsgId: number;
  currentView: PageView;
  playlists: Playlist[];
  channels: Channel[];
  videos: Video[];
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
      type: "change-view";
      payload: PageView;
    }
  | {
      type: "set-playlists";
      payload: Playlist[];
    }
  | {
      type: "set-channels";
      payload: Channel[];
    }
  | {
      type: "set-videos";
      payload: Video[];
    };

export type PoopStoreHelpers = {
  /** Initialize the socket pointing to a specific ws: url. */
  initSocket: (wsUrl: string) => void;
  /** Close the socket when the project unmounts. */
  closeSocket: () => void;
  /**
   * Send a client message to the server. Returns false if the socket isn't connected
   * to the server.
   */
  sendMessage: (msg: ClientMsgNoRequestId) => boolean;
};
