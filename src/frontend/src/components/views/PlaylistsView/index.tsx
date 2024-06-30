/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import PlaylistTable from "#/components/tables/PlaylistTable";
import { Button } from "#/components/ui";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function PlaylistView() {
  const { playlists, sendMessage } = usePoopStore();

  // Get playlists
  useEffect(() => {
    once &&
      sendMessage({
        what: "GET_PLAYLISTS",
        data: null,
      });

    once = false;
  }, [sendMessage]);

  function handleAddPlaylist() {
    sendMessage({
      what: "ADD_PLAYLISTS",
      data: [], // list of urls
    });
  }

  return (
    <>
      <PlaylistTable playlists={playlists} />
      <Button onClick={handleAddPlaylist}>Add Playlists</Button>
    </>
  );
}
