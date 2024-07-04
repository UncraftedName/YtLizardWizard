/** Import react hooks */
import { useEffect } from "react";
/** Import contexts */
import usePoopStore from "#/store/usePoopStore";
/** Import components */
import { ChannelsTable } from "#/components/tables";

export default function ChannelsView() {
  const { channels, sendMessage } = usePoopStore();

  // Get channels
  useEffect(() => {
    sendMessage({
      what: "GET_CHANNELS",
      data: null,
    });
  }, [sendMessage]);

  return (
    <>
      <ChannelsTable channels={channels} />
    </>
  );
}
