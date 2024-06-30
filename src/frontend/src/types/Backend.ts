/** Status of connecting to the backend websocket. */
export type ConnectionStatus = "INIT" | "CONNECTED" | "FAILED" | "CLOSED";

/**
 * Structure of messages sent to the backend.
 */
export type ClientMsg = {
  what: Action;
  requestId: number; // A cum_sum
  data: any;
};

/**
 * Useful for declaring all fields for a client message, but leaving
 * the request id to be set by a helper function.
 */
export type ClientMsgNoRequestId = Omit<ClientMsg, "requestId">;

/**
 * Structure of messages received from the backend.
 */
export type ServerMsg = {
  what: Action;
  requestId: number; // Same cum_sum as above
  final: boolean;
  data: any;
  error: string;
};

export type Action =
  | "INIT"
  | "GET_PLAYLISTS"
  | "REORDER_PLAYLISTS"
  | "ADD_PLAYLISTS"
  | "PLAYLIST_INFO_UPDATE"
  | "REMOVE_PLAYLISTS"
  | "GET_CHANNELS"
  | "CHANNEL_INFO_UPDATE"
  | "GET_VIDEOS"
  | "VIDEO_INFO_UPDATE"
  | "VIDEO_THUMBNAIL_UPDATE"
  | "SET_VIDEOS_DOWNLOADABLE"
  | "DOWNLOAD_PLAYLISTS"
  | "OBJECT_DELETE"
  | "THUMBNAIL_DATA_UPDATE"
  | "DOWNLOAD_AUDIO"
  | "DOWNLOAD_AUDIO_PROGRESS";
