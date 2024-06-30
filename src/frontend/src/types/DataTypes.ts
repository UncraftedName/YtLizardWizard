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
