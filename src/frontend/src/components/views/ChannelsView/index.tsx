/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { ChannelsTable } from "#/components/tables";

let once = true; // Prevent sendMessage in effect from being called multiple times.

export default function ChannelsView() {
  const { channels, sendMessage } = usePoopStore();

  // Get channels
  useEffect(() => {
    once &&
      sendMessage({
        what: "GET_CHANNELS",
        data: null,
      });

    once = false;
  }, [sendMessage]);

  return (
    <>
      <ChannelsTable channels={channels} />
    </>
  );
}
