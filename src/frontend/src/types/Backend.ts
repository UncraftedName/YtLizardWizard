export type ClientMsg = {
  what: string;
  requestId: number; // An cum_sum
  data: any;
};

export type ServerMsg<T> = {
  what: string;
  requestId: number; // Same cum_sum as above
  final: boolean;
  data: T;
  error: string;
};
