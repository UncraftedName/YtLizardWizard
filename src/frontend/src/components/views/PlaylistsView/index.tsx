/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { PlaylistTable } from "#/components/tables";
import { Button } from "#/components/ui";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function PlaylistsView() {
  const { playlists, sendMessage } = usePoopStore();

  useEffect(() => {
    // Reset once when the component unmounts so we fetch data again next time the component mounts.
    return () => {
      once = true;
    };
  }, []);

  // Get playlists
  useEffect(() => {
    if (once) {
      const ok = sendMessage({
        what: "GET_PLAYLISTS",
        data: null,
      });
      if (ok) once = false;
    }
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
