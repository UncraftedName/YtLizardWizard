export type Playlist = {
  id: number;
  version: number;
  name: string;
  url: string;
  ownerChannelId: number;
  numVideos: number;
  status: string;
  renameRulesId: number;
};

export type Channel = {
  id: number;
  version: number;
  name: string;
  url: string;
  numVideos: number;
  status: string;
  renameRulesId: number;
};

export type Video = {
  id: number;
  version: number;
  name: string;
  url: string;
  lengthMs: number;
  thumbnailId: number;
  status: string;
  renameRulesId: number;
};
