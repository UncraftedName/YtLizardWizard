export type ClientMsg = {
  what: string;
  requestId: number; // An cum_sum
  data: any;
};

/**
 * Useful for declaring all fields for a client message, but leaving
 * the request id to be set by a helper function.
 */
export type ClientMsgNoRequestId = Omit<ClientMsg, "requestId">;

export type ServerMsg<T> = {
  what: string;
  requestId: number; // Same cum_sum as above
  final: boolean;
  data: T;
  error: string;
};
