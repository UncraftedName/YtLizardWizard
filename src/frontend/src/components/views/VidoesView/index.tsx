/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { VideosTable } from "#/components/tables";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function VideosView() {
  const { videos, sendMessage } = usePoopStore();

  useEffect(() => {
    // Reset once when the component unmounts so we fetch data again next time the component mounts.
    return () => {
      once = true;
    };
  }, []);

  // Get videos
  useEffect(() => {
    if (once) {
      const ok = sendMessage({
        what: "GET_VIDEOS",
        data: null,
      });
      if (ok) once = false;
    }
  }, [sendMessage]);

  return (
    <>
      <VideosTable videos={videos} />
    </>
  );
}
