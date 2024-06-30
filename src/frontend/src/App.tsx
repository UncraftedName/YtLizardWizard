/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { Header, ErrorMessage } from "./components/ui";
import PlaylistView from "#/components/views/PlaylistView";

function App() {
  const { socketConnStatus, initSocket, closeSocket } = usePoopStore();

  useEffect(() => {
    initSocket();
    return () => {
      closeSocket();
    };
  }, [initSocket, closeSocket]);

  return (
    <>
      <Header />
      {socketConnStatus === "FAILED" && (
        <ErrorMessage text="Something went wrong connecting to the server." />
      )}
      {socketConnStatus === "CLOSED" && (
        <ErrorMessage text="The socket has been closed by the server." />
      )}
      {socketConnStatus === "CONNECTED" && <PlaylistView />}
    </>
  );
}

export default App;
