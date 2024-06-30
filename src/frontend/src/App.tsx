/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import ErrorMessage from "./components/ErrorMessage";
import WebSocketWrapper from "#/components/WebSocketWrapper";
import PlaylistTable from "#/components/PlaylistTable";

function App() {
  const { playlists, socketConnStatus, initSocket, closeSocket } =
    usePoopStore();

  useEffect(() => {
    initSocket();
    return () => {
      closeSocket();
    };
  }, [initSocket, closeSocket]);

  return (
    <div className="h-screen w-screen bg-slate-200">
      <div className="grid w-full place-content-center p-4">
        <div className="flex gap-2">
          <h1 className="inline rounded-md border-2 border-slate-800 p-2 text-3xl font-bold text-red-400 underline shadow-lg">
            Lizard Wizard!!!
          </h1>
          <div className="h-4 w-4 animate-bounce place-self-end rounded-full bg-green-500"></div>
        </div>
      </div>
      {socketConnStatus === "FAILED" && (
        <ErrorMessage text="Something went wrong connecting to the server." />
      )}
      {socketConnStatus === "CLOSED" && (
        <ErrorMessage text="The socket has been closed by the server." />
      )}
      {socketConnStatus === "CONNECTED" && (
        <>
          <WebSocketWrapper />
          <PlaylistTable playlists={playlists} />
        </>
      )}
    </div>
  );
}

export default App;
