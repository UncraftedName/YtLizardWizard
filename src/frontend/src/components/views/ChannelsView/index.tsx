/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { ChannelsTable } from "#/components/tables";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function ChannelsView() {
  const { channels, sendMessage } = usePoopStore();

  useEffect(() => {
    // Reset once when the component unmounts so we fetch data again next time the component mounts.
    return () => {
      once = true;
    };
  }, []);

  // Get channels
  useEffect(() => {
    if (once) {
      const ok = sendMessage({
        what: "GET_CHANNELS",
        data: null,
      });
      if (ok) once = false;
    }
  }, [sendMessage]);

  return (
    <>
      <ChannelsTable channels={channels} />
    </>
  );
}
