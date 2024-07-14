/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { PlaylistTable } from "#/components/tables";
import { Button } from "#/components/ui";

export default function PlaylistsView() {
  const { playlists, sendMessage } = usePoopStore();

  // Get playlists
  useEffect(() => {
    sendMessage({
      what: "GET_PLAYLISTS",
      data: null,
    });
  }, [sendMessage]);

  function handleAddPlaylist() {
    sendMessage({
      what: "ADD_PLAYLISTS",
      data: [], // list of urls
    });
  }

  function handleDownloadPlaylists() {
    sendMessage({
      what: "DOWNLOAD_PLAYLISTS",
      data: null,
    });
  }

  return (
    <>
      <PlaylistTable playlists={playlists} />
      <Button onClick={handleAddPlaylist}>Add Playlists</Button>
      <Button onClick={handleDownloadPlaylists}>Download Playlists</Button>
    </>
  );
}
