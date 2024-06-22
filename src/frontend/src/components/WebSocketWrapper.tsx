import { useState, useRef, useEffect } from "react";

export default function WebSocketWrapper() {
  const [socketStage, setSocketStage] = useState<"Init" | "Connected">("Init");
  const socket = useRef<WebSocket>();

  // Connect and disconnect the socket ref.
  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8080/ws");
    socket.current.onopen = () => setSocketStage("Connected");

    return () => {
      if (!socket.current) return;
      socket.current.close();
    };
  }, []);

  const stageColor =
    socketStage === "Init" ? "text-yellow-400" : "text-green-500";

  return (
    <h3 className="mx-3 text-2xl font-semibold">
      WebSocket init stage:{" "}
      <span className={`${stageColor}`}>{socketStage}</span>
    </h3>
  );
}
