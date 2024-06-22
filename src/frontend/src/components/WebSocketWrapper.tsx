import { useState, useRef, useEffect } from "react";
import { unpack, pack } from "msgpackr";

export default function WebSocketWrapper() {
  const [socketStage, setSocketStage] = useState<
    "Init" | "Connected" | "Failed"
  >("Init");
  const socket = useRef<WebSocket>();
  // eslint-disable-next-line
  const [message, setMessage] = useState<any>(null);

  // Connect and disconnect the socket ref.
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/ws");
    socket.current.binaryType = "arraybuffer";
    socket.current.onopen = () => setSocketStage("Connected");
    socket.current.onerror = () => setSocketStage("Failed");
    socket.current.onmessage = (event) => {
      console.log("message received from backend");
      setMessage(unpack(event.data));
    };

    return () => {
      if (!socket.current) return;
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    if (socketStage !== "Connected" || !socket.current) return;

    // Let's send some massages ;)
    const initRequestObj = {
      what: "INIT",
      requestId: "bob",
      data: null,
    };
    const packedRequest = pack(initRequestObj);
    socket.current.send(packedRequest);
  }, [socketStage]);

  useEffect(() => {
    if (message !== null) {
      console.log("New message received:");
      console.log(message);
    }
  }, [message]);

  // Styling "stage" text
  let stageColor = "text-black";
  if (socketStage === "Init") stageColor = "text-yellow-400";
  if (socketStage === "Connected") stageColor = "text-green-500";
  if (socketStage === "Failed") stageColor = "text-red-600";

  return (
    <>
      <h3 className="mx-3 text-2xl font-semibold">
        WebSocket init stage:{" "}
        <span className={`${stageColor}`}>{socketStage}</span>
      </h3>
      {/* <div>{message}</div> */}
    </>
  );
}
