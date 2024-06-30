/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";

let once = true; // Prevent GET_PLAYLISTS from being called multiple times.

export default function WebSocketWrapper() {
  const { socketConnStatus, sendMessage } = usePoopStore();

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

  // Styling "stage" text
  let stageColor = "text-black";
  if (socketConnStatus === "INIT") stageColor = "text-yellow-400";
  if (socketConnStatus === "CONNECTED") stageColor = "text-green-500";
  if (socketConnStatus === "FAILED") stageColor = "text-red-600";

  return (
    <>
      <h3 className="mx-3 text-2xl font-semibold">
        WebSocket init stage:{" "}
        <span className={`${stageColor}`}>{socketConnStatus}</span>
      </h3>
      <button
        className="m-4 rounded border border-gray-400 bg-slate-300 p-2 text-xl text-blue-700 shadow-xl"
        onClick={handleAddPlaylist}
      >
        Add Playlist
      </button>
    </>
  );
}
