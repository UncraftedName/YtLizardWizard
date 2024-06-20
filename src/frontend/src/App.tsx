import ViteSvg from "./assets/vite.svg";
import { useEffect, useState, useRef } from "react";

function App() {
  const [prog, setProg] = useState(0);
  const intervalRef = useRef<number>();

  const MAXIMUM = 10000;

  const DELTA = 20;
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProg((prev) => prev + DELTA);
    }, DELTA);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (prog > MAXIMUM) clearInterval(intervalRef.current);
  }, [prog]);

  return (
    <div className="h-screen w-screen bg-slate-200">
      <div className="grid w-full place-content-center p-4">
        <div className="flex gap-2">
          <h1 className="inline rounded-md border-2 border-slate-800 p-2 text-3xl font-bold text-red-400 underline shadow-lg">
            Lizard Wizard!!!
          </h1>
          <div className="h-4 w-4 animate-bounce place-self-end rounded-full bg-green-500"></div>
        </div>
      </div>
      <div className="m-10"></div>
      <div className="relative m-2 h-2 w-[150px] rounded-lg bg-gray-200 outline outline-1 outline-black">
        <div
          className="h-full rounded-lg bg-gradient-to-tr from-blue-800 to-green-400"
          style={{ width: `${(prog / MAXIMUM) * 100 * 2}%` }}
        />
      </div>
      <div className="m-10 h-20 w-20 animate-spin rounded-full bg-gradient-to-r from-slate-200 to-slate-800"></div>
      <img src={ViteSvg} className="animate-spin-slow m-10 h-20 w-20" alt="" />
    </div>
  );
}

export default App;
