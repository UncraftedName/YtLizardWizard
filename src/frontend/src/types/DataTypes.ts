export type Playlist = {
  id: bigint;
  version: bigint;
  name: string;
  url: string;
  ownerChannelId: bigint;
  numVideos: bigint;
  status: string;
  renameRulesId: bigint;
};

export type Channel = {
  id: bigint;
  version: bigint;
  name: string;
  url: string;
  numVideos: bigint;
  status: string;
  renameRulesId: bigint;
};

export type Video = {
  id: bigint;
  version: bigint;
  name: string;
  url: string;
  lenMs: bigint;
  thumbnailId: bigint;
  status: string;
  renameRulesId: bigint;
};
