/** Import react hooks */
import { useState, useRef, useEffect } from "react";
/** Import msgpack */
import { unpack, pack } from "msgpackr";
/** Import components */
import PlaylistTable from "./PlaylistTable";
/** Import types */
import type { ClientMsg, ServerMsg } from "#/types/Backend";
import type { PlaylistSendData } from "#/types/BackendResponseData";

export default function WebSocketWrapper() {
  const [socketStage, setSocketStage] = useState<
    "Init" | "Connected" | "Failed"
  >("Init");
  const socket = useRef<WebSocket>();
  const [getPlaylistsResponse, setGetPlaylistsResponse] = useState<ServerMsg<
    PlaylistSendData[]
  > | null>(null);

  // Connect and disconnect the socket ref.
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/ws");
    socket.current.binaryType = "arraybuffer";
    socket.current.onopen = () => setSocketStage("Connected");
    socket.current.onerror = () => setSocketStage("Failed");
    socket.current.onmessage = (event) => {
      const response = unpack(event.data) as unknown as ServerMsg<
        PlaylistSendData[]
      >;
      if (response.what === "PLAYLIST_INFO_UPDATE") {
        setGetPlaylistsResponse(response);
      }
    };

    return () => {
      if (!socket.current) return;
      socket.current.close();
    };
  }, []);

  // Get playlists
  useEffect(() => {
    if (socketStage !== "Connected" || !socket.current) return;

    const initRequestObj: ClientMsg = {
      what: "GET_PLAYLISTS",
      requestId: 0,
      data: null,
    };
    const packedRequest = pack(initRequestObj);
    socket.current.send(packedRequest);
  }, [socketStage]);

  // Styling "stage" text
  let stageColor = "text-black";
  if (socketStage === "Init") stageColor = "text-yellow-400";
  if (socketStage === "Connected") stageColor = "text-green-500";
  if (socketStage === "Failed") stageColor = "text-red-600";

  return (
    <>
      <h3 className="mx-3 text-2xl font-semibold">
        WebSocket init stage:{" "}
        <span className={`${stageColor}`}>{socketStage}</span>
      </h3>
      {getPlaylistsResponse && (
        <PlaylistTable playlists={getPlaylistsResponse.data} />
      )}
    </>
  );
}
