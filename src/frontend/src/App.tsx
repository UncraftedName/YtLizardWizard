/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { Header, ErrorMessage, ViewsMenu } from "./components/ui";
import PlaylistView from "#/components/views/PlaylistsView";

function App() {
  const { socketConnStatus, initSocket, closeSocket } = usePoopStore();

  // Connect to the server using a web socket.
  useEffect(() => {
    initSocket();
    return () => {
      closeSocket();
    };
  }, [initSocket, closeSocket]);

  return (
    <>
      <Header />
      <ViewsMenu />
      {socketConnStatus === "CONNECTED" && <PlaylistView />}
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
