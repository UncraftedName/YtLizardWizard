/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { VideosTable } from "#/components/tables";

export default function VideosView() {
  const { videos, sendMessage } = usePoopStore();

  // Get videos
  useEffect(() => {
    sendMessage({
      what: "GET_VIDEOS",
      data: null,
    });
  }, [sendMessage]);

  return (
    <>
      <VideosTable videos={videos} />
    </>
  );
}
