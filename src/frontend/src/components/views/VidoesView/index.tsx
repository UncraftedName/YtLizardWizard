/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { VideosTable } from "#/components/tables";
import { Action } from "#/types/Backend";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function VideosView() {
  const { videos, sendMessage } = usePoopStore();

  // Get videos
  /** @debug Why GET_VIDEO_INFO instead of GET_VIDEOS? */
  useEffect(() => {
    once &&
      sendMessage({
        what: "GET_VIDEO_INFO" as unknown as Action,
        data: null,
      });

    once = false;
  }, [sendMessage]);

  return (
    <>
      <VideosTable videos={videos} />
    </>
  );
}
