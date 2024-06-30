/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { Header, ErrorMessage, ViewsMenu } from "#/components/ui";
import { ChannelsView, PlaylistsView, VideosView } from "#/components/views";

function App() {
  const { socketConnStatus, currentView, initSocket, closeSocket } =
    usePoopStore();

  // Connect to the server using a web socket.
  useEffect(() => {
    initSocket();
    return () => {
      closeSocket();
    };
  }, [initSocket, closeSocket]);

  let view = null;
  if (currentView === "playlists") view = <PlaylistsView />;
  else if (currentView === "channels") view = <ChannelsView />;
  else if (currentView === "videos") view = <VideosView />;

  return (
    <>
      <Header />
      <ViewsMenu />
      {socketConnStatus === "CONNECTED" && view}
      {socketConnStatus === "FAILED" && (
        <ErrorMessage text="Something went wrong connecting to the server." />
      )}
      {socketConnStatus === "CLOSED" && (
        <ErrorMessage text="The socket has been closed by the server." />
      )}
    </>
  );
}

export default App;
