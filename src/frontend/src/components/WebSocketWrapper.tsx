/** Import react hooks */
import { useState, useEffect } from "react";
/** Import contexts */
import { usePoopStore } from "#/store/PoopStore";
/** Import components */
import PlaylistTable from "./PlaylistTable";
/** Import types */
import type { ClientMsgNoRequestId, ServerMsg } from "#/types/Backend";
import type { PlaylistSendData } from "#/types/BackendResponseData";

export default function WebSocketWrapper() {
  const { connectionStatus, sendMessage } = usePoopStore();
  const [getPlaylistsResponse, setGetPlaylistsResponse] = useState<ServerMsg<
    PlaylistSendData[]
  > | null>(null);

  // Connect and disconnect the socket ref.
  useEffect(() => {
    // socket.current.onmessage = (event) => {
    //   const response = unpack(event.data) as unknown as ServerMsg<
    //     PlaylistSendData[]
    //   >;
    //   if (response.what === "PLAYLIST_INFO_UPDATE") {
    //     setGetPlaylistsResponse((prevResponse) => {
    //       if (!prevResponse) return response;
    //       else {
    //         return {
    //           ...prevResponse,
    //           data: [...prevResponse.data, ...response.data],
    //         };
    //       }
    //     });
    //   }
    // };
  }, []);

  // Get playlists
  useEffect(() => {
    if (connectionStatus === "CONNECTED") {
      const request: ClientMsgNoRequestId = {
        what: "GET_PLAYLISTS",
        data: null,
      };
      sendMessage(request);
    }
  }, [connectionStatus, sendMessage]);

  function handleAddPlaylist() {
    if (connectionStatus === "CONNECTED") {
      const request: ClientMsgNoRequestId = {
        what: "ADD_PLAYLIST",
        data: [], // list of urls
      };
      sendMessage(request);
    }
  }

  // Styling "stage" text
  let stageColor = "text-black";
  if (connectionStatus === "INIT") stageColor = "text-yellow-400";
  if (connectionStatus === "CONNECTED") stageColor = "text-green-500";
  if (connectionStatus === "FAILED") stageColor = "text-red-600";

  return (
    <>
      <h3 className="mx-3 text-2xl font-semibold">
        WebSocket init stage:{" "}
        <span className={`${stageColor}`}>{connectionStatus}</span>
      </h3>
      {getPlaylistsResponse && (
        <PlaylistTable playlists={getPlaylistsResponse.data} />
      )}
      <button
        className="m-4 rounded border border-gray-400 bg-slate-300 p-2 text-xl text-blue-700 shadow-xl"
        onClick={handleAddPlaylist}
      >
        Add Playlist
      </button>
    </>
  );
}
